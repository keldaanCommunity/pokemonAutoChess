import Phaser, { GameObjects } from "phaser"
import { BOARD_WIDTH } from "../../../../config"
import type Player from "../../../../models/colyseus-models/player"
import { type IPokemon, Transfer } from "../../../../types"
import { NonPkm } from "../../../../types/enum/Pokemon"
import { schemaValues } from "../../../../utils/schemas"
import { preference } from "../../preferences"
import store from "../../stores"
import { DEPTH } from "../depths"
import type GameScene from "../scenes/game-scene"
import type BoardManager from "./board-manager"
import { BoardMode } from "./board-manager"
import PokemonSprite from "./pokemon"

export class TradingPlatform extends GameObjects.Container {
  scene: GameScene
  manager: BoardManager
  playerTile: GameObjects.Sprite
  partnerTile: GameObjects.Sprite
  //detail: ItemDetail | undefined
  mouseoutTimeout: NodeJS.Timeout | null = null
  player: Player
  activeVfx: GameObjects.Sprite
  partnerActiveVfx: GameObjects.Sprite
  arrowsVfx: GameObjects.Sprite
  playerTradeIcon: GameObjects.Sprite | null = null
  partnerTradeIcon: GameObjects.Sprite | null = null
  partnerPokemon: PokemonSprite | null = null
  activeTrade: [string, string] | null = null

  constructor(manager: BoardManager, x: number, y: number) {
    super(manager.scene, x, y)
    this.scene = manager.scene
    this.manager = manager
    this.player = manager.player
    this.playerTile = new Phaser.GameObjects.Sprite(
      this.scene,
      0,
      0,
      "trading_platform",
      "trade_tile_inactive/000.png"
    )
    //this.setSize(304, 120)
    this.playerTile
      .setDepth(DEPTH.INANIMATE_OBJECTS)
      .setScale(2)
      .setOrigin(0, 0)
      .setPosition(35, 40)
      .play({ key: "trade_tile_active", repeat: -1 })
    this.add(this.playerTile)

    this.playerTile
      .setInteractive()
      .on("pointerover", (pointer: Phaser.Input.Pointer) => {
        this.onPointerOver(pointer)
      })
      .on("pointerout", () => this.onPointerOut())
      .on(
        "pointerdown",
        (
          pointer: Phaser.Input.Pointer,
          _x: number,
          _y: number,
          event: Phaser.Types.Input.EventData
        ) => {
          this.onPointerDown(pointer, event)
        }
      )

    this.partnerTile = new Phaser.GameObjects.Sprite(
      this.scene,
      0,
      0,
      "trading_platform",
      "trade_tile_inactive/000.png"
    )
    //this.setSize(304, 120)
    this.partnerTile
      .setDepth(DEPTH.INANIMATE_OBJECTS)
      .setScale(2)
      .setOrigin(0, 0)
      .setAlpha(0.5)
      .setPosition(35 + (32 + 64) * 2, 40)
      .play({ key: "trade_tile_active", repeat: -1 })
    this.add(this.partnerTile)

    this.activeVfx = new Phaser.GameObjects.Sprite(
      this.scene,
      67,
      70,
      "abilities",
      "WONDER_ROOM/000.png"
    )
    this.activeVfx.play({ key: "WONDER_ROOM", repeat: -1 })
    this.activeVfx.setVisible(false)
    this.add(this.activeVfx)

    this.partnerActiveVfx = new Phaser.GameObjects.Sprite(
      this.scene,
      67 + (32 + 64) * 2,
      70,
      "abilities",
      "WONDER_ROOM/000.png"
    )
    this.partnerActiveVfx.play({ key: "WONDER_ROOM", repeat: -1 })
    this.partnerActiveVfx.setVisible(false)
    this.add(this.partnerActiveVfx)

    this.arrowsVfx = new Phaser.GameObjects.Sprite(
      this.scene,
      158,
      70,
      "trading_platform",
      "trade_arrows/000.png"
    )
    this.arrowsVfx.play({ key: "trade_arrows", repeat: -1 })
    this.arrowsVfx.setScale(2).setVisible(false)
    this.add(this.arrowsVfx)

    this.scene.add.existing(this)
    this.updateTrade(manager.mode)
  }

  updatePartnerPokemon(pokemon: IPokemon | null) {
    if (this.partnerPokemon) {
      this.partnerPokemon?.destroy()
    }
    if (pokemon === null) {
      this.partnerPokemon = null
    } else {
      this.partnerPokemon = new PokemonSprite(
        this.scene,
        66 + (32 + 64) * 2,
        60,
        pokemon,
        this.player.doubleUpPartnerId,
        false,
        false
      )
      this.partnerPokemon.sprite.setAlpha(0.5)
      this.partnerPokemon.shadow?.setAlpha(0.5)
      this.add(this.partnerPokemon)
    }
  }

  updateTrade(boardMode: BoardMode) {
    const pokemonToTrade =
      schemaValues(this.player.board).find(
        (p) => p.positionX === BOARD_WIDTH - 1 && p.positionY === 0
      ) ?? null

    const gameState = store.getState().game
    const partner = gameState.players.find(
      (p) => p.id === this.player.doubleUpPartnerId
    )

    const partnerPokemonToTrade =
      (partner != null &&
        typeof partner.board?.forEach === "function" &&
        schemaValues(partner.board).find(
          (p) => p.positionX === BOARD_WIDTH - 1 && p.positionY === 0
        )) ||
      null

    if (
      pokemonToTrade &&
      canBeTraded(pokemonToTrade) &&
      partnerPokemonToTrade &&
      canBeTraded(partnerPokemonToTrade)
    ) {
      this.activeTrade = [pokemonToTrade.id, partnerPokemonToTrade.id]
    } else if (
      this.activeTrade != null &&
      (!pokemonToTrade || !partnerPokemonToTrade)
    ) {
      this.activeTrade = null
    }

    if (partnerPokemonToTrade) {
      this.updatePartnerPokemon(partnerPokemonToTrade)
    }
    this.updateTradeUI(boardMode)
  }

  updateTradeUI(boardMode: BoardMode) {
    const shouldShowPlatformUI = boardMode !== BoardMode.TOWN
    const shouldShowActiveTradeUI =
      boardMode === BoardMode.PICK && this.activeTrade != null
    this.setVisible(shouldShowPlatformUI)
    this.activeVfx.setVisible(shouldShowActiveTradeUI)
    this.partnerActiveVfx.setVisible(shouldShowActiveTradeUI)
    this.arrowsVfx.setVisible(shouldShowActiveTradeUI)
    if (shouldShowPlatformUI === false && this.partnerPokemon) {
      this.partnerPokemon?.destroy()
    }
  }

  updateCooldown(value: number, mode: BoardMode) {
    if (value === 0) this.updateTrade(mode)
  }

  openDetail() {
    this.scene.closeTooltips() // close other open tooltips

    /*if (this.detail === undefined) {
      this.detail = new ItemDetail(this.scene, 0, 0, type)
      this.detail.setDepth(DEPTH.TOOLTIP)
      this.detail.setPosition(
        this.detail.width * 0.5 + 40,
        this.detail.height * 0.5
      )
      this.detail.setVisible(false)
      this.detail.dom.addEventListener("mouseenter", () => {
        this.mouseoutTimeout && clearTimeout(this.mouseoutTimeout)
      })
      this.detail.dom.addEventListener("mouseleave", () => {
        if (preference("showDetailsOnHover")) {
          this.mouseoutTimeout = setTimeout(() => {
            if (this.detail?.visible) {
              this.closeDetail()
            }
          }, 0)
        }
      })

      this.add(this.detail)
    }

    this.detail.setVisible(true)*/
  }

  closeDetail() {
    //this.detail?.setVisible(false)
  }

  onPointerOver(pointer: Phaser.Input.Pointer) {
    /*if (preference("showDetailsOnHover") && !this.detail?.visible) {
      this.mouseoutTimeout && clearTimeout(this.mouseoutTimeout)
      this.openDetail()
    }*/
  }

  onPointerOut() {
    if (preference("showDetailsOnHover")) {
      this.mouseoutTimeout = setTimeout(() => {
        /*if (this.detail?.visible) {
          this.closeDetail()
        }*/
      }, 0)
    }
  }

  onPointerDown(
    pointer: Phaser.Input.Pointer,
    event: Phaser.Types.Input.EventData
  ) {
    //this.parentContainer.bringToTop(this)
    event.stopPropagation()
    if (pointer.rightButtonDown() && !preference("showDetailsOnHover")) {
      /*if (!this.detail?.visible) {
        this.openDetail()
      } else {
        this.closeDetail()
      }*/
    } else {
      if (this.player.id !== this.scene.uid) return
      const shouldTrade = true //TODO
      if (this.scene.room && shouldTrade) {
        this.scene.room.send(Transfer.TRADE_PARTNER)
        //this.manager.displayText(pointer.x, pointer.y, t("berry_gained"), true)
        //this.sprite.play("CROP")
      } else {
        //this.manager.displayText(pointer.x, pointer.y, t("berry_unripe"), true)
      }
    }
  }
}

function canBeTraded(pokemon: IPokemon): boolean {
  return NonPkm.includes(pokemon.name) === false
}
