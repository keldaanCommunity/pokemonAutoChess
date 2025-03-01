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
import { Item, ItemRecipe } from "../../../../types/enum/Item"
import { Pkm } from "../../../../types/enum/Pokemon"
import { throttle } from "../../../../utils/function"
import { logger } from "../../../../utils/logger"
import { values } from "../../../../utils/schemas"
import { clearTitleNotificationIcon } from "../../../../utils/window"
import { getGameContainer } from "../../pages/game"
import { SOUNDS, playMusic, playSound } from "../../pages/utils/audio"
import { transformCoordinate } from "../../pages/utils/utils"
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
import UnownManager from "../components/unown-manager"
import WeatherManager from "../components/weather-manager"
import { DEPTH } from "../depths"

export default class GameScene extends Scene {
  tilemaps: Map<DungeonPMDO, DesignTiled> = new Map<DungeonPMDO, DesignTiled>()
  room: Room<GameState> | undefined
  uid: string | undefined
  map: Phaser.Tilemaps.Tilemap | undefined
  battleGroup: GameObjects.Group | undefined
  animationManager: AnimationManager | undefined
  itemsContainer: ItemsContainer | undefined
  board: BoardManager | undefined
  battle: BattleManager | undefined
  weatherManager: WeatherManager | undefined
  unownManager?: UnownManager
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
      this.input.dragDistanceThreshold = 1

      const playerUids = values(this.room.state.players).map((p) => p.id)
      const player = this.room.state.players.get(
        this.spectate ? playerUids[0] : this.uid
      ) as Player

      this.setMap(player.map)
      this.setupMouseEvents()
      this.battleGroup = this.add.group()
      this.animationManager = new AnimationManager(this)
      this.minigameManager = new MinigameManager(
        this,
        this.animationManager,
        this.uid,
        this.room.state.avatars,
        this.room.state.floatingItems
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

      this.unownManager = new UnownManager(this)
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
        this.pokemonHovered.sprite
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
    this.resetDragState()

    if (previousPhase === GamePhaseState.TOWN) {
      this.minigameManager?.dispose()
    }

    if (newPhase === GamePhaseState.FIGHT) {
      this.board?.battleMode()
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
        const coord = transformCoordinate(x, y)
        const zone = this.add.zone(coord[0], coord[1], 96, 96)
        zone.setRectangleDropZone(96, 96)
        zone.setName("board-zone")
        const spotSprite = this.add
          .image(zone.x, zone.y, "cell", 0)
          .setVisible(false)
          .setData({ x, y })
          .setDepth(DEPTH.DROP_ZONE)
        zone.setData({ x, y, sprite: spotSprite })
        this.dropSpots.push(spotSprite)
      }
    }

    this.input.on("pointerdown", (pointer) => {
      if (
        this.minigameManager &&
        this.room?.state.phase === GamePhaseState.TOWN &&
        !this.spectate
      ) {
        const vector = this.minigameManager.getVector(pointer.x, pointer.y)
        this.room?.send(Transfer.VECTOR, vector)

        const clickAnimation = this.add.sprite(
          pointer.x,
          pointer.y,
          "attacks",
          `WATER/cell/000.png`
        )
        clickAnimation.setDepth(DEPTH.INDICATOR)
        clickAnimation.anims.play("WATER/cell")
        this.tweens.add({
          targets: clickAnimation,
          x: pointer.x,
          y: pointer.y,
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
          this.pokemonDragged.setDepth(DEPTH.POKEMON_GRABBED)
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
          const pokemon = new PokemonClasses[this.pokemonDragged!.name as Pkm]()

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
              document.getElementById("game")?.dispatchEvent(
                new CustomEvent<IDragDropMessage>(Transfer.DRAG_DROP, {
                  detail: { x, y, id: gameObject.id }
                })
              )
              this.lastDragDropPokemon = gameObject
            } else {
              // RETURN TO ORIGINAL SPOT
              gameObject.setPosition(...transformCoordinate(x, y))
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
            const [x, y] = transformCoordinate(
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
            document.getElementById("game")?.dispatchEvent(
              new CustomEvent<IDragDropCombineMessage>(
                Transfer.DRAG_DROP_COMBINE,
                {
                  detail: {
                    itemA: dropZone.name,
                    itemB: gameObject.name
                  }
                }
              )
            )
          }
          // Item -> POKEMON(board zone) = EQUIP
          else if (
            dropZone.name == "board-zone" &&
            !(
              this.room?.state.phase == GamePhaseState.FIGHT &&
              dropZone.getData("y") != 0
            )
          ) {
            document.getElementById("game")?.dispatchEvent(
              new CustomEvent<IDragDropItemMessage>(Transfer.DRAG_DROP_ITEM, {
                detail: {
                  x: dropZone.getData("x"),
                  y: dropZone.getData("y"),
                  id: gameObject.name
                }
              })
            )
          }
          // RETURN TO ORIGINAL SPOT
          else {
            const player = getGameContainer().player
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
    })

    this.input.on(
      "dragenter",
      (pointer, gameObject, dropZone) => {
        if (
          gameObject instanceof ItemContainer &&
          dropZone instanceof ItemContainer
        ) {
          // find the resulting item
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
          dropZone.getData("sprite")?.setFrame(1)
        }

        if (
          dropZone.name === "sell-zone" &&
          gameObject instanceof PokemonSprite
        ) {
          dropZone.getData("rectangle")?.setFillStyle(0x6b8bb2)
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
          dropZone.getData("rectangle")?.setFillStyle(0x61738a)
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
    this.pokemonHovered = gameObject
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
}
