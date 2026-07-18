import Phaser, { GameObjects } from "phaser"
import { BOARD_WIDTH } from "../../../../config"
import { canBeTraded } from "../../../../core/trade-logic"
import type Player from "../../../../models/colyseus-models/player"
import { type IPlayer, type IPokemon, Transfer } from "../../../../types"
import { TradeStatus } from "../../../../types/enum/TradeStatus"
import { schemaValues } from "../../../../utils/schemas"
import { addOutlineOnHover } from "../../pages/utils/outline"
import { preference } from "../../preferences"
import store from "../../stores"
import { DEPTH } from "../depths"
import type GameScene from "../scenes/game-scene"
import type BoardManager from "./board-manager"
import { BoardMode } from "./board-manager"
import PokemonSprite from "./pokemon"

export class TradingPlatform extends GameObjects.Container {
  scene: GameScene
  board: BoardManager
  playerTile: GameObjects.Sprite
  partnerTile: GameObjects.Sprite
  //detail: ItemDetail | undefined
  mouseoutTimeout: NodeJS.Timeout | null = null
  player: Player
  activeVfx: GameObjects.Sprite
  partnerActiveVfx: GameObjects.Sprite
  arrowsVfx: GameObjects.Sprite
  playerTradeStatusIcon: GameObjects.Sprite
  partnerTradeStatusIcon: GameObjects.Sprite
  acceptButton: GameObjects.Sprite
  refuseButton: GameObjects.Sprite
  clockIcon: GameObjects.Sprite
  clockText: GameObjects.Text
  partnerPokemon: PokemonSprite | null = null
  pokemonToTrade: IPokemon | null = null
  partnerPokemonToTrade: IPokemon | null = null

  constructor(board: BoardManager, x: number, y: number) {
    super(board.scene, x, y)
    this.scene = board.scene
    this.board = board
    this.player = board.player
    this.playerTile = this.scene.add.sprite(
      0,
      0,
      "trading_platform",
      "trade_tile_inactive/000.png"
    )

    this.playerTile
      .setDepth(DEPTH.INANIMATE_OBJECTS)
      .setScale(2)
      .setOrigin(0, 0)
      .setPosition(35, 40)
      .setInteractive()
      .on("pointerover", (pointer: Phaser.Input.Pointer) => {
        this.onPointerOver(pointer)
      })
      .on("pointerout", () => this.onPointerOut())

    this.partnerTile = this.scene.add
      .sprite(0, 0, "trading_platform", "trade_tile_inactive/000.png")
      .setDepth(DEPTH.INANIMATE_OBJECTS)
      .setScale(2)
      .setOrigin(0, 0)
      .setAlpha(0.5)
      .setPosition(35 + (32 + 64) * 2, 40)

    this.activeVfx = this.scene.add
      .sprite(67, 70, "abilities", "WONDER_ROOM/000.png")
      .play({ key: "WONDER_ROOM", repeat: -1 })
      .setVisible(false)

    this.partnerActiveVfx = this.scene.add
      .sprite(67 + (32 + 64) * 2, 70, "abilities", "WONDER_ROOM/000.png")
      .play({ key: "WONDER_ROOM", repeat: -1 })
      .setVisible(false)

    this.arrowsVfx = this.scene.add
      .sprite(158, 70, "trading_platform", "trade_arrows/000.png")
      .play({ key: "trade_arrows", repeat: -1 })
      .setScale(2)
      .setVisible(false)

    this.acceptButton = this.scene.add
      .sprite(140, 50, "trading_platform", "trade_icons/accept.png")
      .setScale(2)
      .setDepth(DEPTH.TRADE_CONTROLS)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.room?.send(Transfer.TRADE_ACCEPT, true)
      })
    addOutlineOnHover(this.acceptButton)

    this.refuseButton = this.scene.add
      .sprite(140, 100, "trading_platform", "trade_icons/refuse.png")
      .setScale(2)
      .setDepth(DEPTH.TRADE_CONTROLS)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.room?.send(Transfer.TRADE_ACCEPT, false)
      })
    addOutlineOnHover(this.refuseButton)

    this.playerTradeStatusIcon = this.scene.add
      .sprite(140, 70, "trading_platform", "trade_icons/waiting.png")
      .setScale(2)

    this.partnerTradeStatusIcon = this.scene.add
      .sprite(190, 70, "trading_platform", "trade_icons/waiting.png")
      .setScale(2)

    this.clockIcon = this.scene.add
      .sprite(145, 70, "trading_platform", "trade_icons/waiting.png")
      .setScale(2)
    this.clockText = this.scene.add.text(
      170,
      50,
      this.player.tradeCooldown.toString(),
      {
        font: "600 32px Jost",
        color: "white",
        stroke: "black",
        strokeThickness: 4
      }
    )

    this.add([
      this.playerTile,
      this.partnerTile,
      this.activeVfx,
      this.partnerActiveVfx,
      this.arrowsVfx,
      this.acceptButton,
      this.refuseButton,
      this.playerTradeStatusIcon,
      this.partnerTradeStatusIcon,
      this.clockIcon,
      this.clockText
    ])
    this.scene.add.existing(this)
    this.updateTrade(board.mode)
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
    const gameState = store.getState().game
    const partner = gameState.players.find(
      (p) => p.id === this.player.doubleUpPartnerId
    )

    this.pokemonToTrade =
      schemaValues(this.player.board).find(
        (p) =>
          p.positionX === BOARD_WIDTH - 1 && p.positionY === 0 && canBeTraded(p)
      ) ?? null

    this.partnerPokemonToTrade =
      (partner != null &&
        typeof partner.board?.forEach === "function" &&
        schemaValues(partner.board).find(
          (p) =>
            p.positionX === BOARD_WIDTH - 1 &&
            p.positionY === 0 &&
            canBeTraded(p)
        )) ||
      null

    this.updatePartnerPokemon(this.partnerPokemonToTrade)

    const shouldShowPlatformUI = boardMode !== BoardMode.TOWN
    const isOnCooldown = this.player.tradeCooldown > 0
    const hasActiveTrade =
      boardMode === BoardMode.PICK &&
      this.pokemonToTrade != null &&
      this.partnerPokemonToTrade != null &&
      !isOnCooldown
    const hasCancelledTrade =
      this.player.tradeStatus === TradeStatus.REFUSED ||
      partner?.tradeStatus === TradeStatus.REFUSED

    this.setVisible(shouldShowPlatformUI)

    this.activeVfx.setVisible(hasActiveTrade && !hasCancelledTrade)
    this.partnerActiveVfx.setVisible(hasActiveTrade && !hasCancelledTrade)
    this.arrowsVfx.setVisible(hasActiveTrade && !hasCancelledTrade)

    if (shouldShowPlatformUI === false && this.partnerPokemon) {
      this.partnerPokemon.destroy()
    }

    if (hasActiveTrade) {
      if (this.player.tradeStatus === TradeStatus.PENDING) {
        this.acceptButton.setVisible(true)
        this.refuseButton.setVisible(true)
        this.playerTradeStatusIcon.setVisible(false)
      } else {
        this.acceptButton.setVisible(false)
        this.refuseButton.setVisible(false)
        this.playerTradeStatusIcon
          ?.setFrame(TradeStatusIcons[this.player.tradeStatus])
          .setVisible(true)
      }

      this.partnerTradeStatusIcon
        ?.setFrame(
          TradeStatusIcons[partner?.tradeStatus ?? TradeStatus.PENDING]
        )
        .setVisible(true)
    } else {
      this.acceptButton.setVisible(false)
      this.refuseButton.setVisible(false)
      this.playerTradeStatusIcon.setVisible(false)
      this.partnerTradeStatusIcon.setVisible(false)
    }

    this.clockIcon.setVisible(isOnCooldown)
    this.clockText
      .setText(this.player.tradeCooldown.toString())
      .setVisible(isOnCooldown)

    this.playerTile.play({
      key: isOnCooldown ? "trade_tile_inactive" : "trade_tile_active",
      repeat: -1
    })
  }

  updateCooldown(value: number, mode: BoardMode) {
    if (value === 0) this.updateTrade(mode)
  }

  updateTradeIfPokemonInvolved(
    pokemon: IPokemon,
    player: IPlayer,
    boardMode: BoardMode
  ) {
    if (
      (player.id === this.player.doubleUpPartnerId ||
        player.id === this.player.id) &&
      (this.pokemonToTrade?.id === pokemon.id ||
        this.partnerPokemonToTrade?.id === pokemon.id ||
        (pokemon.positionX === BOARD_WIDTH - 1 && pokemon.positionY === 0))
    ) {
      setTimeout(() => this.updateTrade(boardMode), 0)
    }
  }

  showTradeAnimation() {
    for (let p = 0; p < 2; p++) {
      const portal = this.scene.add.sprite(
        66 + (32 + 64) * 2 * p,
        52,
        "trading_platform",
        "trade_portal/000.png"
      )
      portal
        .setScale(2)
        .setDepth(DEPTH.ABILITY)
        .play("trade_portal")
        .once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
          portal.destroy()
        })
      this.add(portal)
    }
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
}

const TradeStatusIcons: Record<TradeStatus, string> = {
  [TradeStatus.ACCEPTED]: "trade_icons/accepted.png",
  [TradeStatus.REFUSED]: "trade_icons/refused.png",
  [TradeStatus.PENDING]: "trade_icons/waiting.png"
}
