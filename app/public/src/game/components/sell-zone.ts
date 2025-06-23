import { t } from "i18next"
import { GameObjects } from "phaser"
import { getSellPrice } from "../../../../models/shop"
import { transformBoardCoordinates } from "../../pages/utils/utils"
import GameScene from "../scenes/game-scene"
import PokemonSprite from "./pokemon"
import { DEPTH } from "../depths"

export class SellZone extends GameObjects.Container {
  scene: GameScene
  rectangle: Phaser.GameObjects.Rectangle
  text: Phaser.GameObjects.Text
  bgColor = 0x61738a
  hoveredBgColor = 0x6b8bb2

  constructor(scene: GameScene) {
    const sellZoneCoord = transformBoardCoordinates(4, 5.5)
    super(scene, sellZoneCoord[0] - 48, sellZoneCoord[1] + 24)
    this.scene = scene

    const sellZone = scene.add.zone(0, 0, 8 * 96, 240)
    sellZone.setRectangleDropZone(8 * 96, 240)
    sellZone.setName("sell-zone")
    this.add(sellZone)

    this.rectangle = scene.add
      .rectangle(
        sellZone.x,
        sellZone.y,
        sellZone.input!.hitArea.width,
        sellZone.input!.hitArea.height,
        this.bgColor,
        1
      )
      .setStrokeStyle(2, 0x000000, 1)
      .setAlpha(0.8)

    this.add(this.rectangle)
    sellZone.setData({ rectangle: this.rectangle })

    this.text = scene.add.text(0, 70, t("drop_here_to_sell"), {
      font: "600 24px Jost",
      color: "white",
      align: "center"
    })
    this.text.setOrigin(0.5, 0.5)
    this.add(this.text)

    this.setVisible(false)
    this.setDepth(DEPTH.SELL_ZONE)
    this.scene.add.existing(this)
  }

  showForPokemon(pkm: PokemonSprite) {
    const specialGameRule = this.scene.room?.state.specialGameRule
    const pokemon = this.scene.board?.player.board.get(pkm.id)
    if (!pokemon) return
    const price = getSellPrice(pokemon, specialGameRule)
    this.text.setText(
      `${t("drop_here_to_sell")} ${t("for_price_gold", { price })}`
    )
    this.rectangle.setFillStyle(this.bgColor)
    this.setVisible(true)
  }

  hide() {
    this.rectangle.setFillStyle(this.bgColor).setAlpha(0.8)
    this.setVisible(false)
  }

  onDragEnter() {
    this.rectangle.setFillStyle(this.hoveredBgColor).setAlpha(0.9)
  }

  onDragLeave() {
    this.rectangle.setFillStyle(this.bgColor).setAlpha(0.8)
  }
}
