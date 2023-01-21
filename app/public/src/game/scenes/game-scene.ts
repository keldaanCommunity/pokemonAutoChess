import { Scene, GameObjects } from "phaser"
import AnimationManager from "../animation-manager"
import BoardManager from "../components/board-manager"
import BattleManager from "../components/battle-manager"
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
import indexList from "../../../dist/client/assets/pokemons/indexList.json"
import {
  IDragDropCombineMessage,
  IDragDropItemMessage,
  IDragDropMessage,
  Transfer
} from "../../../../types"
import { DesignTiled } from "../../../../core/design"
import { loadPreferences } from "../../preferences"

export default class GameScene extends Scene {
  tilemap: DesignTiled | undefined
  room: Room<GameState> | undefined
  uid: string | undefined
  textStyle:
    | { fontSize: string; fontFamily: string; color: string; align: string }
    | undefined
  bigTextStyle:
    | {
        fontSize: string
        fontFamily: string
        color: string
        align: string
        stroke: string
        strokeThickness: number
      }
    | undefined
  map: Phaser.Tilemaps.Tilemap | undefined
  battleGroup: GameObjects.Group | undefined
  animationManager: AnimationManager | undefined
  itemsContainer: ItemsContainer | undefined
  board: BoardManager | undefined
  battle: BattleManager | undefined
  weatherManager: WeatherManager | undefined
  music: Phaser.Sound.WebAudioSound | undefined
  targetPokemon: Pokemon | undefined
  graphics: Phaser.GameObjects.Graphics[] = []
  dragDropText: Phaser.GameObjects.Text | undefined
  sellZoneGraphic: Phaser.GameObjects.Graphics | undefined
  zones: Phaser.GameObjects.Zone[] = []
  lastDragDropPokemon: Pokemon | undefined
  lastPokemonDetail: Pokemon | undefined

  constructor() {
    super({
      key: "gameScene",
      active: false
    })
  }

  init(data) {
    this.tilemap = data.tilemap
    this.room = data.room
    this.uid = firebase.auth().currentUser?.uid
  }

  preload() {
    const progressBar = this.add.graphics()
    const progressBox = this.add.graphics()
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(500, 500, 1020, 50)

    const width = this.cameras.main.width
    const height = this.cameras.main.height
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 100,
      text: "Loading...",
      style: {
        font: "30px monospace"
      }
    })
    loadingText.setOrigin(0.5, 0.5)

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: "0%",
      style: {
        font: "28px monospace"
      }
    })
    percentText.setOrigin(0.5, 0.5)

    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 70,
      text: "",
      style: {
        font: "28px monospace"
      }
    })

    assetText.setOrigin(0.5, 0.5)

    this.load.on("progress", (value: number) => {
      percentText.setText((value * 100).toFixed(1) + "%")
      progressBar.clear()
      progressBar.fillStyle(0xffffff, 1)
      progressBar.fillRect(500, 510, 1000 * value, 30)
    })

    this.load.on("fileprogress", (file) => {
      assetText.setText("Loading asset: " + file.key)
    })

    this.load.on("complete", () => {
      progressBar.destroy()
      progressBox.destroy()
      loadingText.destroy()
      percentText.destroy()
      assetText.destroy()
    })

    indexList.forEach((id) => {
      this.load.multiatlas(
        id,
        `/assets/pokemons/${id}.json`,
        "/assets/pokemons"
      )
    })

    if (this.tilemap) {
      this.load.audio("sound", [
        `https://raw.githubusercontent.com/keldaanInteractive/pokemonAutoChessMusic/main/music/${this.tilemap.tilesets[0].name}.mp3`
      ])
      this.load.image(
        "tiles",
        `/assets/tilesets/${this.tilemap.tilesets[0].name}.png`
      )
      this.load.tilemapTiledJSON("map", this.tilemap)
    }
    this.load.image("rain", "/assets/ui/rain.png")
    this.load.image("sand", "/assets/ui/sand.png")
    this.load.image("sun", "/assets/ui/sun.png")
    this.load.multiatlas(
      "snowflakes",
      "/assets/ui/snowflakes.json",
      "/assets/ui/"
    )
    this.load.multiatlas(
      "status",
      "/assets/status/status.json",
      "/assets/status/"
    )
    this.load.multiatlas("wound", "/assets/status/wound.json", "/assets/status")
    this.load.multiatlas(
      "resurection",
      "/assets/status/resurection.json",
      "/assets/status"
    )
    this.load.multiatlas("smoke", "/assets/status/SMOKE.json", "/assets/status")
    this.load.multiatlas(
      "rune_protect",
      "/assets/status/RUNE_PROTECT.json",
      "/assets/status"
    )
    this.load.multiatlas(
      "armorReduction",
      "/assets/status/ARMOR_REDUCTION.json",
      "/assets/status"
    )
    this.load.multiatlas(
      "ELECTRIC_SURGE",
      "/assets/status/ELECTRIC_SURGE.json",
      "/assets/status"
    )
    this.load.multiatlas(
      "VOID_BOOST",
      "/assets/status/VOID_BOOST.json",
      "/assets/status"
    )
    this.load.multiatlas(
      "PSYCHIC_SURGE",
      "/assets/status/PSYCHIC_SURGE.json",
      "/assets/status"
    )
    this.load.multiatlas("item", "/assets/item/item.json", "/assets/item/")
    this.load.multiatlas("lock", "/assets/lock/lock.json", "/assets/lock/")
    this.load.multiatlas(
      "attacks",
      "/assets/attacks/attacks.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "specials",
      "/assets/attacks/specials.json",
      "/assets/attacks"
    )
    this.load.multiatlas("june", "/assets/attacks/june.json", "/assets/attacks")
    this.load.multiatlas(
      "ROAR_OF_TIME",
      "/assets/attacks/ROAR_OF_TIME.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "ROCK_TOMB",
      "/assets/attacks/ROCK_TOMB.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "ROCK_SMASH",
      "/assets/attacks/ROCK_SMASH.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "VOLT_SWITCH",
      "/assets/attacks/VOLT_SWITCH.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "STEAM_ERUPTION",
      "/assets/attacks/STEAM_ERUPTION.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "APPLE_ACID",
      "/assets/attacks/APPLE_ACID.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "LIQUIDATION",
      "/assets/attacks/LIQUIDATION.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "PAYDAY",
      "/assets/attacks/PAYDAY.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "HYPER_VOICE",
      "/assets/attacks/HYPER_VOICE.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "SHADOW_CLONE",
      "/assets/attacks/SHADOW_CLONE.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "PETAL_DANCE",
      "/assets/attacks/PETAL_DANCE.json",
      "/assets/attacks"
    )
    this.load.multiatlas("ECHO", "/assets/attacks/ECHO.json", "/assets/attacks")
    this.load.multiatlas(
      "INCENSE_DAMAGE",
      "/assets/attacks/INCENSE_DAMAGE.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "BRIGHT_POWDER",
      "/assets/attacks/BRIGHT_POWDER.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "STATIC",
      "/assets/attacks/STATIC.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "EXPLOSION",
      "/assets/attacks/EXPLOSION.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "EARTHQUAKE",
      "/assets/attacks/EARTHQUAKE.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "AQUA_JET",
      "/assets/attacks/AQUA_JET.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "MIND_BLOWN",
      "/assets/attacks/MIND_BLOWN.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "MIND_BLOWN_SELF",
      "/assets/attacks/MIND_BLOWN_SELF.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "SOFT_BOILED",
      "/assets/attacks/SOFT_BOILED.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "BONEMERANG",
      "/assets/attacks/BONEMERANG.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "GROWL",
      "/assets/attacks/GROWL.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "RELIC_SONG",
      "/assets/attacks/RELIC_SONG.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "DISARMING_VOICE",
      "/assets/attacks/DISARMING_VOICE.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "HIGH_JUMP_KICK",
      "/assets/attacks/HIGH_JUMP_KICK.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "TRI_ATTACK",
      "/assets/attacks/TRI_ATTACK.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "CLANGOROUS_SOUL",
      "/assets/attacks/CLANGOROUS_SOUL.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "CONFUSING_MIND",
      "/assets/attacks/CONFUSING_MIND.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "SONG_OF_DESIRE",
      "/assets/attacks/SONG_OF_DESIRE.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "FIELD_DEATH",
      "/assets/attacks/FIELD_DEATH.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "FAIRY_CRIT",
      "/assets/attacks/FAIRY_CRIT.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "BLUE_FLARE",
      "/assets/attacks/BLUE_FLARE.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "FUSION_BOLT",
      "/assets/attacks/FUSION_BOLT.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "CHATTER",
      "/assets/attacks/CHATTER.json",
      "/assets/attacks"
    )
    this.load.multiatlas(
      "pmd-replace",
      "/assets/attacks/pmd-replace.json",
      "/assets/attacks"
    )
    this.load.image("money", "/assets/ui/money.svg")
    this.load.multiatlas(
      "ICE_RANGE",
      "/assets/attacks/ICE_RANGE.json",
      "/assets/attacks"
    )
  }

  create() {
    if (this.uid && this.tilemap && this.room) {
      this.textStyle = {
        fontSize: "35px",
        fontFamily: "brandonGrotesque",
        color: "black",
        align: "center"
      }

      this.bigTextStyle = {
        fontSize: "80px",
        fontFamily: "brandonGrotesque",
        color: "white",
        align: "center",
        stroke: "#000",
        strokeThickness: 3
      }
      this.input.mouse.disableContextMenu()

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
      this.itemsContainer = new ItemsContainer(
        this,
        this.room.state.players[this.uid].items,
        24 * 24 + 10,
        5 * 24 + 10,
        true
      )
      this.board = new BoardManager(
        this,
        this.room.state.players[this.uid],
        this.animationManager,
        this.uid
      )
      this.battle = new BattleManager(
        this,
        this.battleGroup,
        this.room.state.players[this.uid],
        this.animationManager
      )
      this.weatherManager = new WeatherManager(this)
      this.music = this.sound.add("sound", { loop: true }) as Phaser.Sound.WebAudioSound	
      const musicVolume = loadPreferences().musicVolume / 100
      this.music.play({ volume: musicVolume, loop: true })
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
      this.sellPokemon()
    })
  }

  refreshShop() {
    this.room?.send(Transfer.REFRESH)
  }

  buyExperience() {
    this.room?.send(Transfer.LEVEL_UP)
  }

  sellPokemon() {
    if (!this.targetPokemon) {
      return
    }
    const d = document.getElementById("game")
    if (d) {
      d.dispatchEvent(
        new CustomEvent(Transfer.SELL_DROP, {
          detail: {
            pokemonId: this.targetPokemon.id
          }
        })
      )
    }
  }

  updatePhase() {
    this.targetPokemon = undefined
    if (this.room?.state.phase == GamePhaseState.FIGHT) {
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
      sellZoneCoord[0] - 2 * 96 + 24,
      sellZoneCoord[1],
      "Drop here to sell",
      this.textStyle
    )
    this.dragDropText.setVisible(false)

    this.input.mouse.disableContextMenu()

    this.input.on(
      "gameobjectover",
      (pointer, gameObject: Phaser.GameObjects.GameObject) => {
        if (gameObject instanceof Pokemon) {
          this.targetPokemon = gameObject
        } else {
          this.targetPokemon = undefined
        }
      }
    )

    this.input.on(
      "dragstart",
      (pointer, gameObject: Phaser.GameObjects.GameObject) => {
        gameObject instanceof Pokemon
          ? this.drawRectangles(true)
          : this.drawRectangles(false)
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
            document.getElementById("game")?.dispatchEvent(
              new CustomEvent<IDragDropMessage>(Transfer.DRAG_DROP, {
                detail: {
                  x: dropZone.getData("x"),
                  y: dropZone.getData("y"),
                  id: gameObject.id
                }
              })
            )
            this.lastDragDropPokemon = gameObject
          }
          // POKEMON -> SELL-ZONE = SELL POKEMON
          else if (dropZone.name == "sell-zone") {
            document.getElementById("game")?.dispatchEvent(
              new CustomEvent(Transfer.SELL_DROP, {
                detail: {
                  pokemonId: gameObject.id
                }
              })
            )
          }
          // RETURN TO ORIGINAL SPOT
          else {
            gameObject.x = gameObject.input.dragStartX
            gameObject.y = gameObject.input.dragStartY
          }
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
              gameObject.showTempDetail(key)
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
