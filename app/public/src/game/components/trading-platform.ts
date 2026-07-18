import { t } from "i18next"
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
import { GameDialog } from "./game-dialog"
import PokemonSprite from "./pokemon"

export class TradingPlatform extends GameObjects.Container {
  scene: GameScene
  board: BoardManager
  playerTile: GameObjects.Sprite
  partnerTile: GameObjects.Sprite
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
  detail: GameDialog | null = null

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
    this.addTooltip(this.playerTile, "player_tile")

    this.partnerTile = this.scene.add
      .sprite(0, 0, "trading_platform", "trade_tile_inactive/000.png")
      .setDepth(DEPTH.INANIMATE_OBJECTS)
      .setScale(2)
      .setOrigin(0, 0)
      .setAlpha(0.5)
      .setPosition(35 + (32 + 64) * 2, 40)
    this.addTooltip(this.partnerTile, "partner_tile")

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
      const vfx = this.scene.add.sprite(
        66 + (32 + 64) * 2 * p,
        52,
        "trading_platform",
        "trade_warp/000.png"
      )
      vfx
        .setScale(2)
        .setDepth(DEPTH.ABILITY)
        .play("trade_warp")
        .once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
          vfx.destroy()
        })
      this.add(vfx)
    }
    }
  openDetail(tooltip: TradeTooltip) {
    this.scene.closeTooltips() // close other open tooltips
    this.detail?.destroy()
    this.detail = new GameDialog({
      scene: this.scene,
      dialogTitle: t(`board_tooltips_titles.${tooltip}`),
      dialog: t(`board_tooltips.${tooltip}`)
    })
      this.detail.setDepth(DEPTH.TOOLTIP)
      this.detail.setPosition(
      this.detail.width * 0.5 + 80,
      this.detail.height * 0.5 - 80
      )
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

  closeDetail() {
    this.detail?.setVisible(false)
  }

  onPointerOver(pointer: Phaser.Input.Pointer, tooltip: TradeTooltip) {
    if (preference("showDetailsOnHover") && !this.detail?.visible) {
      this.mouseoutTimeout && clearTimeout(this.mouseoutTimeout)
      this.openDetail(tooltip)
    }
  }

  onPointerOut() {
    if (preference("showDetailsOnHover")) {
      this.mouseoutTimeout = setTimeout(() => {
        if (this.detail?.visible) {
          this.closeDetail()
        }
      }, 0)
    }
  }

  onPointerDown(pointer: Phaser.Input.Pointer, tooltip: TradeTooltip) {
    if (pointer.rightButtonDown() && !preference("showDetailsOnHover")) {
      if (!this.detail?.visible) {
        this.openDetail(tooltip)
      } else {
        this.closeDetail()
      }
    }
  }

  addTooltip(obj: Phaser.GameObjects.GameObject, tooltip: TradeTooltip) {
    obj
      .setInteractive()
      .on("pointerover", (pointer: Phaser.Input.Pointer) => {
        this.onPointerOver(pointer, tooltip)
      })
      .on("pointerout", () => this.onPointerOut())
      .on("pointerdown", (pointer: Phaser.Input.Pointer) => {
        this.onPointerDown(pointer, tooltip)
      })
  }
}

const TradeStatusIcons: Record<TradeStatus, string> = {
  [TradeStatus.ACCEPTED]: "trade_icons/accepted.png",
  [TradeStatus.REFUSED]: "trade_icons/refused.png",
  [TradeStatus.PENDING]: "trade_icons/waiting.png"
}

type TradeTooltip = "partner_tile" | "player_tile"
