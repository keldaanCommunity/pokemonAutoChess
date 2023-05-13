import { Scene, GameObjects } from "phaser"
import AnimationManager from "../animation-manager"
import BoardManager from "../components/board-manager"
import BattleManager from "../components/battle-manager"
import UnownManager from "../components/unown-manager"
import WeatherManager from "../components/weather-manager"
import ItemsContainer from "../components/items-container"
import Pokemon from "../components/pokemon"
import { ItemRecipe } from "../../../../types/Config"
import firebase from "firebase/compat/app"
import { transformCoordinate } from "../../pages/utils/utils"
import { Room } from "colyseus.js"
import GameState from "../../../../rooms/states/game-state"
import ItemContainer from "../components/item-container"
import { GamePhaseState } from "../../../../types/enum/Game"
import { Pkm } from "../../../../types/enum/Pokemon"
import PokemonFactory from "../../../../models/pokemon-factory"
import {
  IDragDropCombineMessage,
  IDragDropItemMessage,
  IDragDropMessage,
  Transfer
} from "../../../../types"
import { DesignTiled } from "../../../../core/design"
import { loadPreferences } from "../../preferences"
import { Item } from "../../../../types/enum/Item"
import Player from "../../../../models/colyseus-models/player"
import MinigameManager from "../components/minigame-manager"
import LoadingManager from "../components/loading-manager"

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
  pokemonHovered: Pokemon | undefined
  pokemonDragged: Pokemon | undefined
  graphics: Phaser.GameObjects.Graphics[] = []
  dragDropText: Phaser.GameObjects.Text | undefined
  sellZoneGraphic: Phaser.GameObjects.Graphics | undefined
  zones: Phaser.GameObjects.Zone[] = []
  lastDragDropPokemon: Pokemon | undefined
  lastPokemonDetail: Pokemon | undefined
  minigameManager: MinigameManager
  loadingManager: LoadingManager
  started: boolean
  spectate: boolean

  constructor() {
    super({
      key: "gameScene",
      active: false
    })
  }

  init(data: {
    room: Room<GameState>,
    tilemap: DesignTiled,
    spectate: boolean
  }) {
    this.tilemap = data.tilemap
    this.room = data.room
    this.spectate = data.spectate
    this.uid = firebase.auth().currentUser?.uid
    this.started = false
  }

  preload() {
    this.loadingManager = new LoadingManager(this)

    this.room!.onMessage(Transfer.LOADING_COMPLETE, () => {
      if (!this.started) {
        this.started = true
        this.startGame()
      }
    })
  }

  create() {
    this.input.mouse.disableContextMenu()
  }

  startGame() {
    if (this.uid && this.tilemap && this.room) {
      this.registerKeys()

      this.input.dragDistanceThreshold = 1
      this.map = this.make.tilemap({ key: "map" })
      const tileset = this.map.addTilesetImage(
        this.tilemap.tilesets[0].name,
        "tiles",
        24,
        24,
        1,
        1
      )
      this.map.createLayer("World", tileset, 0, 0).setScale(2, 2)
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
      this.room.state.players.forEach(p => playerUids.push(p.id))

      const player = this.room.state.players.get(this.spectate ? playerUids[0] : this.uid) as Player

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
        this.uid
      )
      this.battle = new BattleManager(
        this,
        this.battleGroup,
        player,
        this.animationManager
      )
     
      this.weatherManager = new WeatherManager(this)
      this.unownManager = new UnownManager(
        this,
        this.animationManager,
        this.uid
      )
      this.music = this.sound.add("sound", {
        loop: true
      }) as Phaser.Sound.WebAudioSound
      const musicVolume = loadPreferences().musicVolume / 100
      this.music.play({ volume: musicVolume, loop: true })
    }
  }

  update(time: number, delta: number) {
    super.update(time, delta)
    if (this.lastPokemonDetail) {
      this.lastPokemonDetail.updateTooltipPosition()
    }
  }

  registerKeys() {
    this.input.keyboard.on("keyup-D", () => {
      this.refreshShop()
    })

    this.input.keyboard.on("keyup-F", () => {
      this.buyExperience()
    })

    this.input.keyboard.on("keyup-E", () => {
      if (this.pokemonHovered) {
        this.sellPokemon(this.pokemonHovered)
      }
    })
  }

  setPlayer(player: Player) {
    this.board?.setPlayer(player)
    this.battle?.setPlayer(player)
    this.itemsContainer?.setPlayer(player)
  }

  refreshShop() {
    this.room?.send(Transfer.REFRESH)
  }

  buyExperience() {
    this.room?.send(Transfer.LEVEL_UP)
  }

  sellPokemon(pokemon: Pokemon) {
    if (!pokemon) {
      return
    }
    const d = document.getElementById("game")
    if (d) {
      d.dispatchEvent(
        new CustomEvent(Transfer.SELL_DROP, {
          detail: {
            pokemonId: pokemon.id
          }
        })
      )
    }
  }

  updatePhase() {
    this.resetDragState()
    if (
      this.room?.state.phase == GamePhaseState.FIGHT ||
      this.room?.state.phase === GamePhaseState.MINIGAME
    ) {
      this.board?.battleMode()
    } else {
      this.board?.pickMode()
    }
  }

  drawRectangles(sellZoneVisible: boolean) {
    this.graphics.forEach((rect) => {
      rect.setVisible(true)
    })
    this.dragDropText?.setVisible(sellZoneVisible)
    this.sellZoneGraphic?.setVisible(sellZoneVisible)
  }

  removeRectangles() {
    this.graphics.forEach((rect) => {
      rect.setVisible(false)
    })
    this.dragDropText?.setVisible(false)
    this.sellZoneGraphic?.setVisible(false)
  }

  resetDragState() {
    if (this.pokemonDragged) {
      this.input.emit(
        "dragend",
        this.input.pointer1,
        this.pokemonDragged,
        false
      )
      this.pokemonDragged = undefined
    }
  }

  initializeDragAndDrop() {
    this.zones = []
    this.graphics = []

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 8; j++) {
        const coord = transformCoordinate(j, i)
        const zone = this.add.zone(coord[0], coord[1], 96, 96)
        zone.setRectangleDropZone(96, 96)
        zone.setName("board-zone")
        zone.setData({ x: j, y: i })
        this.zones.push(zone)
        const graphic = this.add
          .graphics()
          .fillStyle(0x61738a, 1)
          .fillCircle(zone.x, zone.y, zone.input.hitArea.width / 4)
          .lineStyle(2, 0x000000, 1)
          .strokeCircle(zone.x, zone.y, zone.input.hitArea.width / 4)
        graphic.setVisible(false)
        this.graphics.push(graphic)
      }
    }
    const sellZoneCoord = transformCoordinate(4, 5.5)
    const sellZone = this.add.zone(
      sellZoneCoord[0] - 48,
      sellZoneCoord[1] + 24,
      8 * 96,
      240
    )
    sellZone.setRectangleDropZone(8 * 96, 240)
    sellZone.setName("sell-zone")
    this.zones.push(sellZone)

    const graphic = this.add
      .graphics()
      .fillStyle(0x61738a, 1)
      .fillRect(
        sellZone.x - sellZone.input.hitArea.width / 2,
        sellZone.y - sellZone.input.hitArea.height / 2,
        sellZone.input.hitArea.width,
        sellZone.input.hitArea.height
      )
      .lineStyle(2, 0x000000, 1)
      .strokeRect(
        sellZone.x - sellZone.input.hitArea.width / 2,
        sellZone.y - sellZone.input.hitArea.height / 2,
        sellZone.input.hitArea.width,
        sellZone.input.hitArea.height
      )
    graphic.setVisible(false)

    this.sellZoneGraphic = graphic

    this.dragDropText = this.add.text(
      sellZone.x,
      sellZone.y,
      "Drop here to sell",
      {
        fontSize: "35px",
        fontFamily: "brandonGrotesque",
        color: "black",
        align: "center"
      }
    )
    this.dragDropText.setVisible(false)
    this.dragDropText.setOrigin(0.5)

    this.input.mouse.disableContextMenu()
    this.input.on("pointerdown", (pointer) => {
      if (
        this.minigameManager &&
        this.room?.state.phase === GamePhaseState.MINIGAME
        && !this.spectate
      ) {
        const vector = this.minigameManager.getVector(pointer.x, pointer.y)
        this.room?.send(Transfer.VECTOR, vector)

        const clickAnimation = this.add.sprite(
          pointer.x,
          pointer.y,
          "attacks",
          `WATER/cell/000`
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
        if (gameObject instanceof Pokemon) {
          this.pokemonHovered = gameObject
        } else {
          this.pokemonHovered = undefined
        }
      }
    )

    this.input.on(
      "dragstart",
      (pointer, gameObject: Phaser.GameObjects.GameObject) => {
        if (gameObject instanceof Pokemon) {
          this.pokemonDragged = gameObject
          this.dragDropText?.setText(
            `Drop here to sell for ${PokemonFactory.getSellPrice(
              gameObject.name as Pkm
            )} gold`
          )
          this.drawRectangles(true)
        } else {
          this.drawRectangles(false)
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
      }
    )

    this.input.on(
      "drop",
      (
        pointer,
        gameObject: Phaser.GameObjects.GameObject,
        dropZone: Phaser.GameObjects.Zone
      ) => {
        this.removeRectangles()

        if (gameObject instanceof Pokemon) {
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
          this.pokemonDragged = undefined
        } else if (gameObject instanceof ItemContainer) {
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
            this.itemsContainer?.updateItems()
            // gameObject.x = gameObject.input.dragStartX
            // gameObject.y = gameObject.input.dragStartY
          }
        }
      },
      this
    )

    this.input.on("dragend", (pointer, gameObject, dropped) => {
      this.removeRectangles()
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
