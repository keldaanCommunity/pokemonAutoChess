import { t } from "i18next"
import type Phaser from "phaser"
import { GameObjects } from "phaser"
import type { Item } from "../../../../types"
import { transformBoardCoordinates } from "../../pages/utils/utils"
import { DEPTH } from "../depths"
import type GameScene from "../scenes/game-scene"

export class UseItemZone extends GameObjects.Container {
  scene: GameScene
  rectangle: Phaser.GameObjects.Rectangle
  text: Phaser.GameObjects.Text
  bgColor = 0x61738a
  hoveredBgColor = 0x6b8bb2

  constructor(scene: GameScene) {
    const zoneCoord = transformBoardCoordinates(4, 5.5)
    super(scene, zoneCoord[0] - 48, zoneCoord[1] + 24)
    this.scene = scene

    const zone = scene.add.zone(0, 0, 8 * 96, 240)
    zone.setRectangleDropZone(8 * 96, 240)
    zone.setName("useitem-zone")
    this.add(zone)

    this.rectangle = scene.add
      .rectangle(
        zone.x,
        zone.y,
        zone.input!.hitArea.width,
        zone.input!.hitArea.height,
        this.bgColor,
        1
      )
      .setStrokeStyle(2, 0x000000, 1)
      .setAlpha(0.8)

    this.add(this.rectangle)
    zone.setData({ rectangle: this.rectangle })

    this.text = scene.add.text(0, -80, t("drop_here_to_sell"), {
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

  showForItem(item: Item) {
    this.text.setText(`${t("drop_here_to_open")}`)
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
