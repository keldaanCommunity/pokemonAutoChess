import { Room } from "colyseus.js"
import firebase from "firebase/compat/app"
import { GameObjects, Scene } from "phaser"
import OutlinePlugin from "phaser3-rex-plugins/plugins/outlinepipeline-plugin"
import { DesignTiled } from "../../../../core/design"
import { canSell } from "../../../../core/pokemon-entity"
import Player from "../../../../models/colyseus-models/player"
import { PokemonClasses } from "../../../../models/colyseus-models/pokemon"
import GameState from "../../../../rooms/states/game-state"
import {
  IDragDropCombineMessage,
  IDragDropItemMessage,
  IDragDropMessage,
  Transfer
} from "../../../../types"
import {
  DungeonDetails,
  DungeonMusic,
  DungeonPMDO
} from "../../../../types/enum/Dungeon"
import { GamePhaseState } from "../../../../types/enum/Game"
import { Item, ItemRecipe, Mulches } from "../../../../types/enum/Item"
import { Pkm } from "../../../../types/enum/Pokemon"
import { throttle } from "../../../../utils/function"
import { logger } from "../../../../utils/logger"
import { clamp } from "../../../../utils/number"
import { values } from "../../../../utils/schemas"
import { clearTitleNotificationIcon } from "../../../../utils/window"
import { playMusic, playSound, SOUNDS } from "../../pages/utils/audio"
import { transformBoardCoordinates } from "../../pages/utils/utils"
import { preference } from "../../preferences"
import AnimationManager from "../animation-manager"
import BattleManager from "../components/battle-manager"
import BoardManager from "../components/board-manager"
import ItemContainer from "../components/item-container"
import ItemsContainer from "../components/items-container"
import LoadingManager from "../components/loading-manager"
import MinigameManager from "../components/minigame-manager"
import PokemonSprite from "../components/pokemon"
import { SellZone } from "../components/sell-zone"
import WanderersManager from "../components/wanderers-manager"
import WeatherManager from "../components/weather-manager"
import { DEPTH } from "../depths"
import { FLOWER_POTS_POSITIONS } from "../../../../core/flower-pots"
import { BOARD_WIDTH } from "../../../../types/Config"
import { clearAbilityAnimations } from "../components/abilities-animations"

export default class GameScene extends Scene {
  tilemaps: Map<DungeonPMDO, DesignTiled> = new Map<DungeonPMDO, DesignTiled>()
  room: Room<GameState> | undefined
  uid: string | undefined
  map: Phaser.Tilemaps.Tilemap | undefined
  battleGroup: GameObjects.Group | undefined
  abilitiesVfxGroup: GameObjects.Group | undefined
  animationManager: AnimationManager | undefined
  itemsContainer: ItemsContainer | undefined
  board: BoardManager | undefined
  battle: BattleManager | undefined
  weatherManager: WeatherManager | undefined
  wandererManager?: WanderersManager
  music: Phaser.Sound.WebAudioSound | undefined
  pokemonHovered: PokemonSprite | null = null
  pokemonDragged: PokemonSprite | null = null
  shopIndexHovered: number | null = null
  itemDragged: ItemContainer | null = null
  dropSpots: Phaser.GameObjects.Image[] = []
  sellZone: SellZone | undefined
  zones: Phaser.GameObjects.Zone[] = []
  lastDragDropPokemon: PokemonSprite | undefined
  lastPokemonDetail: PokemonSprite | null = null
  minigameManager: MinigameManager | null = null
  loadingManager: LoadingManager | null = null
  started: boolean = false
  spectate: boolean = false

  constructor() {
    super({
      key: "gameScene",
      active: false
    })
  }

  init(data: { room: Room<GameState>; spectate: boolean }) {
    this.tilemaps = new Map()
    this.room = data.room
    this.spectate = data.spectate
    this.uid = firebase.auth().currentUser?.uid
    this.started = false
  }

  preload() {
    this.loadingManager = new LoadingManager(this)

    this.load.on("progress", (value: number) => {
      this.room?.send(Transfer.LOADING_PROGRESS, value * 100)
    })

    this.load.on("complete", () => {
      this.room?.send(Transfer.LOADING_COMPLETE)
    })

    this.room!.onMessage(Transfer.LOADING_COMPLETE, () => {
      if (!this.started) {
        this.started = true
        this.startGame()
      }
    })
  }

  startGame() {
    if (this.uid && this.room) {
      this.registerKeys()
      this.setupCamera()
      this.input.dragDistanceThreshold = 1

      const playerUids = values(this.room.state.players).map((p) => p.id)
      const player = this.room.state.players.get(
        this.spectate ? playerUids[0] : this.uid
      ) as Player

      this.setMap(player.map)
      this.setupMouseEvents()
      this.battleGroup = this.add.group()
      this.abilitiesVfxGroup = this.add.group()
      this.animationManager = new AnimationManager(this)
      this.minigameManager = new MinigameManager(
        this,
        this.animationManager,
        this.uid,
        this.room.state
      )

      this.itemsContainer = new ItemsContainer(
        this,
        player.items,
        22 * 24 + 10,
        5 * 24 + 10,
        null,
        this.uid
      )
      this.board = new BoardManager(
        this,
        player,
        this.animationManager,
        this.uid,
        this.room.state
      )
      this.battle = new BattleManager(
        this,
        this.battleGroup,
        this.room.state.simulations.get(player.simulationId),
        this.animationManager,
        player
      )

      this.weatherManager = new WeatherManager(this)
      this.weatherManager?.setTownDaytime(0)

      this.wandererManager = new WanderersManager(this)
      if (!this.music) {
        playMusic(
          this,
          DungeonDetails[player.map].music ?? DungeonMusic.TREASURE_TOWN
        )
      }
      //;(this.sys as any).animatedTiles.init(this.map)
      clearTitleNotificationIcon()
    }
  }

  update(time: number, delta: number) {
    super.update(time, delta)
    if (this.lastPokemonDetail) {
      this.lastPokemonDetail.updateTooltipPosition()
    }
    if (
      this.room?.state?.phase === GamePhaseState.TOWN &&
      this.minigameManager
    ) {
      this.minigameManager.update()
    }
  }

  setupCamera() {
    this.cameras.main.setBounds(
      0,
      0,
      (this.map?.widthInPixels ?? 1200) * 2,
      (this.map?.heightInPixels ?? 768) * 2
    )

    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      this.cameras.main.zoom = clamp(
        this.cameras.main.zoom - Math.sign(deltaY) * 0.1,
        1,
        2
      )
      //this.cameras.main.centerOn(pointer.worldX, pointer.worldY)
      if (deltaY < 0) {
        this.cameras.main.pan(pointer.worldX, pointer.worldY, 400, "Power2")
      } else if (this.cameras.main.zoom === 1) {
        this.cameras.main.pan(0, 0, 400, "Power2")
      }
    })

    this.input.on("pointermove", (pointer) => {
      if (!pointer.isDown || this.itemDragged || this.pokemonDragged) return
      const cam = this.cameras.main
      if (cam.zoom === 1) return
      cam.scrollX -= (pointer.x - pointer.prevPosition.x) / cam.zoom
      cam.scrollY -= (pointer.y - pointer.prevPosition.y) / cam.zoom
    })
  }

  registerKeys() {
    const keybindings = preference("keybindings")
    this.input.keyboard!.removeAllListeners()
    this.input.keyboard!.on(
      "keydown-" + keybindings.refresh,
      throttle(() => {
        playSound(SOUNDS.REFRESH, 0.5)
        this.refreshShop()
      }, 300)
    )

    this.input.keyboard!.on("keydown-" + keybindings.lock, () => {
      this.room?.send(Transfer.LOCK)
    })

    this.input.keyboard!.on("keydown-" + keybindings.buy_xp, () => {
      this.buyExperience()
    })

    this.input.keyboard!.on("keydown-" + keybindings.sell, (e) => {
      if (this.pokemonDragged != null) return
      if (this.shopIndexHovered !== null) {
        this.removeFromShop(this.shopIndexHovered)
        this.shopIndexHovered = null
      } else if (
        this.pokemonHovered &&
        this.pokemonHovered
          .getBounds()
          .contains(
            this.game.input.activePointer.x,
            this.game.input.activePointer.y
          )
      ) {
        this.sellPokemon(this.pokemonHovered)
        this.pokemonHovered = null
      }
    })

    this.input.keyboard!.on("keydown-" + keybindings.switch, () => {
      if (this.pokemonHovered) {
        this.switchBetweenBenchAndBoard(this.pokemonHovered)
      }
    })
  }

  refreshShop() {
    const player = this.room?.state.players.get(this.uid!)
    const rollCost = (player?.shopFreeRolls ?? 0) > 0 ? 0 : 1
    const canRoll = (player?.money ?? 0) >= rollCost
    if (player && player.alive && canRoll && player === this.board?.player) {
      this.room?.send(Transfer.REFRESH)
      playSound(SOUNDS.REFRESH, 0.5)
    }
  }

  buyExperience() {
    this.room?.send(Transfer.LEVEL_UP)
  }

  sellPokemon(pokemon: PokemonSprite) {
    if (!pokemon) return
    this.room?.send(Transfer.SELL_POKEMON, pokemon.id)
  }

  removeFromShop(index: number) {
    this.room?.send(Transfer.REMOVE_FROM_SHOP, index)
  }

  switchBetweenBenchAndBoard(pokemon: PokemonSprite) {
    if (!pokemon) return
    this.room?.send(Transfer.SWITCH_BENCH_AND_BOARD, pokemon.id)
  }

  updatePhase(newPhase: GamePhaseState, previousPhase: GamePhaseState) {
    this.weatherManager?.clearWeather()
    clearAbilityAnimations(this)
    this.resetDragState()

    if (previousPhase === GamePhaseState.TOWN) {
      this.minigameManager?.dispose()
    }

    if (newPhase === GamePhaseState.FIGHT) {
      this.board?.battleMode(true)
    } else if (newPhase === GamePhaseState.TOWN) {
      this.board?.minigameMode()
      this.weatherManager?.setTownDaytime(this.room?.state.stageLevel ?? 0)
    } else {
      this.board?.pickMode()
    }
  }

  preloadMaps(mapNames: DungeonPMDO[]) {
    return Promise.all(
      mapNames.map((mapName: DungeonPMDO) =>
        fetch(`/tilemap/${mapName}`)
          .then((res) => res.json())
          .then((tilemap: DesignTiled) => {
            this.tilemaps.set(mapName, tilemap)
            tilemap.tilesets.forEach((t) => {
              //logger.debug(`loading tileset ${mapName + "/" + t.name}`)
              this.load.image(
                mapName + "/" + t.name,
                "/assets/tilesets/" + mapName + "/" + t.image
              )
            })
            this.load.tilemapTiledJSON("map_" + mapName, tilemap)
          })
      )
    )
  }

  async setMap(mapName: DungeonPMDO | "town") {
    this.board?.hideGroundHoles()

    if (mapName === "town") {
      this.map = this.add.tilemap("town")
      const tileset = this.map.addTilesetImage("town_tileset", "town_tileset")!
      this.map.createLayer("layer0", tileset, 0, 0)?.setScale(2, 2)
      this.map.createLayer("layer1", tileset, 0, 0)?.setScale(2, 2)
      this.map.createLayer("layer2", tileset, 0, 0)?.setScale(2, 2)
      const sys = this.sys as any
      if (sys.animatedTiles) {
        sys.animatedTiles.pause()
      }
      return
    }

    const tilemap = this.tilemaps.get(mapName)
    if (!tilemap)
      return logger.error(`Tilemap not yet loaded for map ${mapName}`)

    const map = this.make.tilemap({ key: "map_" + mapName })
    if (this.map) this.map.destroy()
    this.map = map
    tilemap.layers.forEach((layer) => {
      const tileset = map.addTilesetImage(
        layer.name,
        mapName + "/" + layer.name
      )!
      tileset.image?.setFilter(Phaser.Textures.FilterMode.NEAREST)
      map.createLayer(layer.name, tileset, 0, 0)?.setScale(2, 2)
    })
    const sys = this.sys as any
    if (sys.animatedTiles) {
      sys.animatedTiles.init(map)
      if (preference("disableAnimatedTilemap")) {
        sys.animatedTiles.pause()
      }
    }
  }

  resetDragState() {
    if (this.pokemonDragged) {
      this.input.emit(
        "dragend",
        this.input.activePointer,
        this.pokemonDragged,
        false
      )
      this.pokemonDragged = null
    } else if (this.itemDragged) {
      this.itemDragged.closeDetail()
      if (this.itemDragged.input) {
        this.itemDragged.x = this.itemDragged.input.dragStartX
        this.itemDragged.y = this.itemDragged.input.dragStartY
      }
      this.input.emit("dragend", this.input.pointer1, this.itemDragged, false)
      this.itemDragged = null
    }
    this.input.setDragState(this.input.pointer1, 0)
  }

  setupMouseEvents() {
    this.sellZone = new SellZone(this)
    this.dropSpots = []

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 8; x++) {
        const coord = transformBoardCoordinates(x, y)
        const zone = this.add.zone(coord[0], coord[1], 96, 96)
        zone.setRectangleDropZone(96, 96)
        zone.setName("board-zone")
        const spotSprite = this.add
          .image(zone.x, zone.y, "board_cell", 0)
          .setVisible(false)
          .setData({ x, y })
          .setDepth(DEPTH.DROP_CELL)
          .setScale(2, 2)
        zone.setData({ x, y, sprite: spotSprite })
        this.dropSpots.push(spotSprite)
      }
    }

    for (let i = 0; i < FLOWER_POTS_POSITIONS.length; i++) {
      const [x, y] = FLOWER_POTS_POSITIONS[i]
      const zone = this.add.zone(x, y, 48, 48)
      zone.setRectangleDropZone(48, 48)
      zone.setName("flower-pot-zone")
      zone.setData({ x, y, index: i })
    }

    this.input.on("pointerdown", (pointer) => {
      if (
        pointer.leftButtonDown() &&
        this.minigameManager &&
        this.room?.state.phase === GamePhaseState.TOWN &&
        !this.spectate
      ) {
        // compute actual x/y coordinates after taking into account camera scroll and zoom
        const camera = this.cameras.main
        const x = camera.worldView.left + pointer.x / camera.zoom
        const y = camera.worldView.top + pointer.y / camera.zoom
        const [minX, maxY] = transformBoardCoordinates(-1, 0)
        const [maxX, minY] = transformBoardCoordinates(8, 7)
        if (x < minX || x > maxX || y > maxY || y < minY) return
        const vector = this.minigameManager.getVector(x, y)
        this.room?.send(Transfer.VECTOR, vector)

        const clickAnimation = this.add.sprite(
          x,
          y,
          "attacks",
          `WATER/cell/000.png`
        )
        clickAnimation.setDepth(DEPTH.INDICATOR)
        clickAnimation.anims.play("WATER/cell")
        this.tweens.add({
          targets: clickAnimation,
          x,
          y,
          ease: "linear",
          yoyo: true,
          duration: 200,
          onComplete: () => {
            clickAnimation.destroy()
          }
        })
      }
      if (this.board && !pointer.rightButtonDown()) {
        this.board.closeTooltips()
      }
    })

    this.input.on(
      Phaser.Input.Events.GAMEOBJECT_OVER,
      (pointer, gameObject: Phaser.GameObjects.GameObject) => {
        if (gameObject instanceof PokemonSprite && gameObject.draggable) {
          this.setHovered(gameObject)
        }
      }
    )

    this.input.on(
      Phaser.Input.Events.GAMEOBJECT_OUT,
      (pointer, gameObject: Phaser.GameObjects.GameObject) => {
        if (this.pokemonHovered === gameObject) {
          this.clearHovered(this.pokemonHovered)
          this.pokemonHovered = null
        }
      }
    )

    this.input.on(
      "dragstart",
      (pointer, gameObject: Phaser.GameObjects.GameObject) => {
        if (gameObject instanceof PokemonSprite) {
          this.pokemonDragged = gameObject
          this.pokemonDragged.setDepth(DEPTH.DRAGGED_POKEMON)
          this.dropSpots.forEach((spot) => {
            if (
              this.room?.state.phase === GamePhaseState.PICK ||
              spot.getData("y") === 0
            ) {
              spot.setFrame(0).setVisible(true)
            }
          })

          if (
            this.sellZone &&
            canSell(
              this.pokemonDragged.name as Pkm,
              this.room?.state.specialGameRule
            )
          ) {
            this.sellZone.showForPokemon(this.pokemonDragged)
          }
        } else if (gameObject instanceof ItemContainer) {
          this.itemDragged = gameObject
        }
      }
    )

    this.input.on(
      "drag",
      (
        pointer,
        gameObject: Phaser.GameObjects.GameObject,
        dragX: number,
        dragY: number
      ) => {
        const g = <Phaser.GameObjects.Container>gameObject
        g.x = dragX
        g.y = dragY
        if (g && this.pokemonDragged != null) {
          const pkm = <Pkm>this.pokemonDragged!.name
          const pokemon = new PokemonClasses[pkm](pkm)

          this.dropSpots.forEach((spot) => {
            const inBench = spot.getData("y") === 0
            let visible = false
            if (inBench) {
              visible = pokemon.canBeBenched
            } else if (this.room?.state.phase === GamePhaseState.PICK) {
              visible = true
            }
            spot.setVisible(visible)
          })
          if (
            this.sellZone?.visible === false &&
            canSell(
              this.pokemonDragged.name as Pkm,
              this.room?.state.specialGameRule
            )
          ) {
            this.sellZone.setVisible(true)
          }
        }
      }
    )

    this.input.on(
      "drop",
      (
        pointer,
        gameObject: Phaser.GameObjects.GameObject,
        dropZone: Phaser.GameObjects.Zone
      ) => {
        this.dropSpots.forEach((spot) => spot.setVisible(false))
        this.sellZone?.hide()

        if (gameObject instanceof PokemonSprite) {
          // POKEMON -> BOARD-ZONE = PLACE POKEMON
          if (dropZone.name == "board-zone") {
            const [x, y] = [dropZone.getData("x"), dropZone.getData("y")]
            if (gameObject.positionX !== x || gameObject.positionY !== y) {
              this.dispatchEvent<IDragDropMessage>(Transfer.DRAG_DROP, { x, y, id: gameObject.id })
              this.lastDragDropPokemon = gameObject
            } else {
              // RETURN TO ORIGINAL SPOT
              gameObject.setPosition(...transformBoardCoordinates(x, y))
            }
          }
          // POKEMON -> SELL-ZONE = SELL POKEMON
          else if (dropZone.name == "sell-zone") {
            if (gameObject === this.pokemonDragged) {
              this.sellPokemon(this.pokemonDragged)
            }
          }
          // RETURN TO ORIGINAL SPOT
          else {
            const [x, y] = transformBoardCoordinates(
              gameObject.positionX,
              gameObject.positionY
            )
            gameObject.setPosition(x, y)
          }
          gameObject.setDepth(DEPTH.POKEMON)
          this.pokemonDragged = null
        } else if (
          gameObject instanceof ItemContainer &&
          this.itemDragged != null
        ) {
          // Item -> Item = COMBINE
          if (dropZone instanceof ItemContainer) {
            this.dispatchEvent<IDragDropCombineMessage>(Transfer.DRAG_DROP_COMBINE, {
              itemA: dropZone.name,
              itemB: gameObject.name
            })
          }
          // Item -> POKEMON(board zone) = EQUIP
          else if (
            dropZone.name === "board-zone" &&
            !(
              this.room?.state.phase == GamePhaseState.FIGHT &&
              dropZone.getData("y") != 0
            )
          ) {
            this.dispatchEvent<IDragDropItemMessage>(Transfer.DRAG_DROP_ITEM, {
              zone: dropZone.name,
              index: dropZone.getData("x") + dropZone.getData("y") * BOARD_WIDTH,
              id: gameObject.name
            })
          }
          // Item -> POKEMON(flower pot zone) = EQUIP OR MULCH
          else if (dropZone.name === "flower-pot-zone") {
            this.dispatchEvent<IDragDropItemMessage>(Transfer.DRAG_DROP_ITEM, {
              zone: dropZone.name,
              index: dropZone.getData("index"),
              id: gameObject.name
            })
          }
          // RETURN TO ORIGINAL SPOT
          else {
            const player = this.room?.state.players.get(this.uid!)
            if (player) this.itemsContainer?.render(player.items)
          }
          this.itemDragged = null
        }
      },
      this
    )

    this.input.on("dragend", (pointer, gameObject, dropped) => {
      this.sellZone?.hide()
      this.dropSpots.forEach((spot) => spot.setVisible(false))
      if (!dropped && gameObject?.input) {
        gameObject.x = gameObject.input.dragStartX
        gameObject.y = gameObject.input.dragStartY
      }
      this.pokemonDragged = null
      this.itemDragged = null
    })

    this.input.on(
      "dragenter",
      (pointer, gameObject, dropZone) => {
        if (
          gameObject instanceof ItemContainer &&
          dropZone instanceof ItemContainer
        ) {
          // item dragged above another item: find the resulting item
          for (const [key, value] of Object.entries(ItemRecipe)) {
            if (
              (value[0] == gameObject.name && value[1] == dropZone.name) ||
              (value[0] == dropZone.name && value[1] == gameObject.name)
            ) {
              this.itemsContainer?.sendToBack(dropZone)
              gameObject.showTempDetail(key as Item)
              break
            }
          }
        }

        if (
          dropZone.name === "board-zone" &&
          gameObject instanceof PokemonSprite
        ) {
          // pokemon dragged above board zone: highlight the cell
          dropZone.getData("sprite")?.setFrame(1)
        }

        if (gameObject instanceof ItemContainer && dropZone.name === "board-zone" && !(
          this.room?.state.phase == GamePhaseState.FIGHT &&
          dropZone.getData("y") != 0
        ) && this.board?.pokemons) {
          const pokemonOnCell = [...this.board.pokemons.values()].find(p => p.positionX === dropZone.getData("x") && p.positionY === dropZone.getData("y"))
          if (pokemonOnCell) {
            // item dragged over a pokemon, highlight the pokemon
            this.setHovered(pokemonOnCell)
          }
        }

        if (gameObject instanceof ItemContainer && dropZone.name === "flower-pot-zone" && Mulches.includes(gameObject.name)) {
          const flowerMonSprite = this.board?.flowerPokemonsInPots[dropZone.getData("index")]
          if (flowerMonSprite) {
            this.setHovered(flowerMonSprite)
          }
        }

        if (
          dropZone.name === "sell-zone" &&
          gameObject instanceof PokemonSprite
        ) {
          // pokemon dragged above sell zone: highlight the sell zone
          this.sellZone?.onDragEnter()
        }
      },
      this
    )

    this.input.on(
      "dragleave",
      (pointer, gameObject, dropZone) => {
        if (
          gameObject instanceof ItemContainer &&
          dropZone instanceof ItemContainer
        ) {
          gameObject.closeDetail()
        }

        if (
          dropZone.name === "board-zone" &&
          gameObject instanceof PokemonSprite
        ) {
          dropZone.getData("sprite")?.setFrame(0)
        }

        if (
          dropZone.name === "sell-zone" &&
          gameObject instanceof PokemonSprite
        ) {
          this.sellZone?.onDragLeave()
        }

        if (dropZone.name === "board-zone" &&
          gameObject instanceof ItemContainer &&
          this.board?.pokemons) {
          const pokemonOnCell = [...this.board.pokemons.values()].find(p => p.positionX === dropZone.getData("x") && p.positionY === dropZone.getData("y"))
          if (pokemonOnCell) {
            this.clearHovered(pokemonOnCell)
          }
        }
      },
      this
    )
  }

  setHovered(gameObject: PokemonSprite) {
    const outline = <OutlinePlugin>this.plugins.get("rexOutline")
    if (!outline) return // outline plugin doesnt work with canvas renderer
    if (this.pokemonHovered != null) this.clearHovered(this.pokemonHovered)
    this.pokemonHovered = gameObject

    const thickness = Math.round(
      1 + Math.log(gameObject.def + gameObject.speDef)
    )

    outline.add(gameObject.sprite, {
      thickness,
      outlineColor: 0xffffff
    })
  }

  clearHovered(gameObject: PokemonSprite) {
    const outline = <OutlinePlugin>this.plugins.get("rexOutline")
    if (!outline) return // outline plugin doesnt work with canvas renderer
    outline.remove(gameObject.sprite)
  }

  displayMoneyGain(x: number, y: number, gain: number) {
    const textStyle = {
      fontSize: "25px",
      fontFamily: "Verdana",
      color: "#FFFF00",
      align: "center",
      strokeThickness: 2,
      stroke: "#000"
    }
    const text = this.add.existing(
      new GameObjects.Text(
        this,
        x - 40,
        y - 50,
        `${gain > 0 ? "+ " : ""}${gain} GOLD`,
        textStyle
      )
    )
    text.setDepth(DEPTH.TEXT_MAJOR)
    this.add.tween({
      targets: [text],
      ease: "Linear",
      duration: 1000,
      delay: 0,
      alpha: {
        getStart: () => 1,
        getEnd: () => 0
      },
      y: {
        getStart: () => y - 50,
        getEnd: () => y - 110
      },
      onComplete: () => {
        text.destroy()
      }
    })
  }

  shakeCamera(options?: { intensity?: number; duration?: number }) {
    if (preference("disableCameraShake")) return
    this.cameras.main.shake(options?.duration ?? 250, options?.intensity ?? 0.01)
  }

  dispatchEvent<T>(eventName: string, detail: T) {
    document.getElementById("game")?.dispatchEvent(
      new CustomEvent<T>(eventName, {
        detail
      })
    )
  }
}
