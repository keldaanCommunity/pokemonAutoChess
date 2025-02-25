import { t } from "i18next"
import { GameObjects } from "phaser"
import { getSellPrice } from "../../../../models/shop"
import { transformCoordinate } from "../../pages/utils/utils"
import GameScene from "../scenes/game-scene"
import PokemonSprite from "./pokemon"
import { DEPTH } from "../depths"

export class SellZone extends GameObjects.Container {
  scene: GameScene
  rectangle: Phaser.GameObjects.Rectangle
  text: Phaser.GameObjects.Text

  constructor(scene: GameScene) {
    const sellZoneCoord = transformCoordinate(4, 5.5)
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
        0x61738a,
        1
      )
      .setStrokeStyle(2, 0x000000, 1)

    this.add(this.rectangle)
    sellZone.setData({ rectangle: this.rectangle })

    this.text = scene.add.text(0, 0, t("drop_here_to_sell"), {
      font: "600 35px Jost",
      color: "black",
      align: "center"
    })
    this.text.setOrigin(0.5)
    this.add(this.text)

    this.setVisible(false)
    this.setDepth(DEPTH.DROP_ZONE)
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
    this.rectangle.setFillStyle(0x61738a)
    this.setVisible(true)
  }

  hide() {
    this.rectangle.setFillStyle(0x61738a)
    this.setVisible(false)
  }
}
