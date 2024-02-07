import { Room } from "colyseus.js"
import firebase from "firebase/compat/app"
import { t } from "i18next"
import { GameObjects, Scene } from "phaser"
import { DesignTiled } from "../../../../core/design"
import { canSell } from "../../../../core/pokemon-entity"
import Simulation from "../../../../core/simulation"
import Player from "../../../../models/colyseus-models/player"
import PokemonFactory from "../../../../models/pokemon-factory"
import GameState from "../../../../rooms/states/game-state"
import {
  IDragDropCombineMessage,
  IDragDropItemMessage,
  IDragDropMessage,
  Transfer
} from "../../../../types"
import { Dungeon, DungeonPMDO } from "../../../../types/Config"
import { GamePhaseState } from "../../../../types/enum/Game"
import { Item, ItemRecipe } from "../../../../types/enum/Item"
import { Pkm } from "../../../../types/enum/Pokemon"
import { clearTitleNotificationIcon } from "../../../../utils/window"
import { getGameContainer, getGameScene } from "../../pages/game"
import { SOUNDS, playMusic, playSound } from "../../pages/utils/audio"
import { transformCoordinate } from "../../pages/utils/utils"
import { preferences } from "../../preferences"
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

export default class GameScene extends Scene {
  tilemap: DesignTiled | undefined
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
  pokemonHovered: PokemonSprite | undefined
  pokemonDragged: PokemonSprite | null = null
  shopIndexHovered: number | null = null
  itemDragged: ItemContainer | null = null
  dropSpots: Phaser.GameObjects.Graphics[] = []
  sellZone: SellZone | undefined
  zones: Phaser.GameObjects.Zone[] = []
  lastDragDropPokemon: PokemonSprite | undefined
  lastPokemonDetail: PokemonSprite | null
  minigameManager: MinigameManager
  loadingManager: LoadingManager
  started: boolean
  spectate: boolean
  dungeon: DungeonPMDO | undefined
  dungeonMusic: Dungeon | undefined

  constructor() {
    super({
      key: "gameScene",
      active: false
    })
  }

  init(data: {
    room: Room<GameState>
    tilemap: DesignTiled
    spectate: boolean
  }) {
    this.tilemap = data.tilemap
    this.room = data.room
    this.spectate = data.spectate
    this.uid = firebase.auth().currentUser?.uid
    this.started = false
    this.dungeon = data.room.state.mapName as DungeonPMDO
    this.dungeonMusic = data.room.state.mapMusic as Dungeon
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
    if (this.uid && this.tilemap && this.room) {
      this.registerKeys()

      this.input.dragDistanceThreshold = 1
      this.map = this.make.tilemap({ key: "map" })
      this.tilemap.layers.forEach((layer) => {
        const tileset = this.map!.addTilesetImage(layer.name, layer.name)!
        this.map?.createLayer(layer.name, tileset, 0, 0)!.setScale(2, 2)
      })
      ;(this.sys as any).animatedTiles.init(this.map)

      if (preferences.disableAnimatedTilemap) {
        ;(this.sys as any).animatedTiles.pause()
      }
      this.initializeDragAndDrop()
      this.battleGroup = this.add.group()
      this.animationManager = new AnimationManager(this)
      this.minigameManager = new MinigameManager(
        this,
        this.animationManager,
        this.uid,
        this.room.state.avatars,
        this.room.state.floatingItems
      )

      const playerUids: string[] = []
      this.room.state.players.forEach((p) => playerUids.push(p.id))

      const player = this.room.state.players.get(
        this.spectate ? playerUids[0] : this.uid
      ) as Player

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
      this.unownManager = new UnownManager(this)
      playSound(SOUNDS.CAROUSEL_UNLOCK) // playing a preloaded sound for players who tabbed out during loading
      playMusic(
        this,
        this.dungeonMusic ? this.dungeonMusic : Dungeon.AMP_PLAINS
      )
      ;(this.sys as any).animatedTiles.init(this.map)
      clearTitleNotificationIcon()
    }
  }

  update(time: number, delta: number) {
    super.update(time, delta)
    if (this.lastPokemonDetail) {
      this.lastPokemonDetail.updateTooltipPosition()
    }
  }

  registerKeys() {
    this.input.keyboard!.on("keydown-D", () => {
      this.refreshShop()
    })

    this.input.keyboard!.on("keydown-F", () => {
      this.buyExperience()
    })

    this.input.keyboard!.on("keydown-E", () => {
      if (this.pokemonHovered) {
        this.sellPokemon(this.pokemonHovered)
      } else if (this.shopIndexHovered !== null) {
        this.removeFromShop(this.shopIndexHovered)
      }
    })
  }

  setPlayer(player: Player) {
    this.battle?.setPlayer(player)
    this.board?.setPlayer(player)
    this.itemsContainer?.setPlayer(player)
  }

  setSimulation(simulation: Simulation) {
    this.battle?.setSimulation(simulation)
  }

  refreshShop() {
    this.room?.send(Transfer.REFRESH)
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

  updatePhase() {
    this.weatherManager?.clearWeather()
    this.resetDragState()
    if (this.room?.state.phase == GamePhaseState.FIGHT) {
      this.board?.battleMode()
    } else if (this.room?.state.phase === GamePhaseState.MINIGAME) {
      this.board?.minigameMode()
    } else {
      this.board?.pickMode()
    }
  }

  resetDragState() {
    if (this.pokemonDragged) {
      this.input.emit(
        "dragend",
        this.input.pointer1,
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

  initializeDragAndDrop() {
    this.sellZone = new SellZone(this)
    this.dropSpots = []

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 8; j++) {
        const coord = transformCoordinate(j, i)
        const zone = this.add.zone(coord[0], coord[1], 96, 96)
        zone.setRectangleDropZone(96, 96)
        zone.setName("board-zone")
        zone.setData({ x: j, y: i })
        const graphic = this.add
          .graphics()
          .fillStyle(0x61738a, 1)
          .fillCircle(zone.x, zone.y, zone.input!.hitArea.width / 4)
          .lineStyle(2, 0x000000, 1)
          .strokeCircle(zone.x, zone.y, zone.input!.hitArea.width / 4)
        graphic.setVisible(false)
        this.dropSpots.push(graphic)
      }
    }

    this.input.on("pointerdown", (pointer) => {
      if (
        this.minigameManager &&
        this.room?.state.phase === GamePhaseState.MINIGAME &&
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
        clickAnimation.setDepth(7)
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
      if (this.board) {
        this.board.closeTooltips()
      }
    })

    this.input.on(
      "gameobjectover",
      (pointer, gameObject: Phaser.GameObjects.GameObject) => {
        if (gameObject instanceof PokemonSprite) {
          this.pokemonHovered = gameObject
        } else {
          this.pokemonHovered = undefined
        }
      }
    )

    this.input.on(
      "dragstart",
      (pointer, gameObject: Phaser.GameObjects.GameObject) => {
        if (gameObject instanceof PokemonSprite) {
          this.pokemonDragged = gameObject
          this.dropSpots.forEach((spot) => spot.setVisible(true))

          if (
            canSell(
              this.pokemonDragged.name as Pkm,
              this.room?.state.specialLobbyRule
            )
          ) {
            const price = PokemonFactory.getSellPrice(
              gameObject.name as Pkm,
              getGameContainer().player
            )
            this.sellZone?.text.setText(
              `${t("drop_here_to_sell")} ${t("for_price_gold", { price })}`
            )
            this.sellZone?.setVisible(true)
          }
        } else if (gameObject instanceof ItemContainer) {
          this.itemDragged = gameObject
        }
        // this.children.bringToTop(gameObject);
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
          this.dropSpots.forEach((spot) => spot.setVisible(true))
          if (
            this.sellZone?.visible === false &&
            canSell(
              this.pokemonDragged.name as Pkm,
              this.room?.state.specialLobbyRule
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
        this.sellZone?.setVisible(false)

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
      this.sellZone?.setVisible(false)
      this.dropSpots.forEach((spot) => spot.setVisible(false))
      if (!dropped) {
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
      },
      this
    )
  }
}

// if (item && item.name && item != gameObject) {
//   Object.keys(ItemRecipe).forEach((recipeName)=>{
//     const recipe = ItemRecipe[recipeName];
//     if ((recipe[0] == item.name && recipe[1] == gameObject.name) || (recipe[1] == item.name && recipe[0] == gameObject.name)) {
//       item.detailDisabled = true;
//       item.detail.setScale(0, 0);
//       gameObject.sprite.setTexture('item', recipeName);
//       gameObject.remove(gameObject.detail, true);
//       gameObject.detail = new ItemDetail(this, 30, -100, recipeName);
//       gameObject.detail.setScale(1, 1);
//       gameObject.add(gameObject.detail);
//     }
//   });
// }
