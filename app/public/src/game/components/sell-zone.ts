import { t } from "i18next"
import { GameObjects } from "phaser"
import { transformCoordinate } from "../../pages/utils/utils"

export class SellZone extends GameObjects.Container {
  graphic: Phaser.GameObjects.Graphics
  zone: Phaser.GameObjects.Zone
  text: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene) {
    const sellZoneCoord = transformCoordinate(4, 5.5)
    super(scene, sellZoneCoord[0] - 48, sellZoneCoord[1] + 24)

    const sellZone = scene.add.zone(0, 0, 8 * 96, 240)
    sellZone.setRectangleDropZone(8 * 96, 240)
    sellZone.setName("sell-zone")
    this.add(sellZone)

    this.graphic = scene.add
      .graphics()
      .fillStyle(0x61738a, 1)
      .fillRect(
        sellZone.x - sellZone.input!.hitArea.width / 2,
        sellZone.y - sellZone.input!.hitArea.height / 2,
        sellZone.input!.hitArea.width,
        sellZone.input!.hitArea.height
      )
      .lineStyle(2, 0x000000, 1)
      .strokeRect(
        sellZone.x - sellZone.input!.hitArea.width / 2,
        sellZone.y - sellZone.input!.hitArea.height / 2,
        sellZone.input!.hitArea.width,
        sellZone.input!.hitArea.height
      )
    this.add(this.graphic)

    this.text = scene.add.text(0, 0, t("drop_here_to_sell"), {
      fontSize: "35px",
      fontFamily: "brandonGrotesque",
      color: "black",
      align: "center"
    })
    this.text.setOrigin(0.5)
    this.add(this.text)

    this.setVisible(false)
    this.scene.add.existing(this)
  }
}
