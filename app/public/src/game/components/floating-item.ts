import { GameObjects } from "phaser"
import { Item } from "../../../../types/enum/Item"
import GameScene from "../scenes/game-scene"
import { DEPTH } from "../depths"

export class FloatingItem extends GameObjects.Container {
  circle: GameObjects.Ellipse
  sprite: GameObjects.Image
  id: string
  constructor(
    scene: Phaser.Scene,
    id: string,
    x: number,
    y: number,
    item: Item
  ) {
    super(scene, x, y)
    this.name = item
    this.id = id
    this.circle = new GameObjects.Ellipse(scene, 0, 0, 40, 40, 0x61738a, 1)
    this.circle.setStrokeStyle(1, 0xffffff, 0.7)
    this.add(this.circle)
    this.sprite = new GameObjects.Image(scene, 0, 0, "item", this.name + ".png")
    this.sprite.setScale(0.32)
    this.add(this.sprite)
    this.setDepth(DEPTH.INANIMATE_OBJECTS)
    this.scene.add.existing(this)
  }

  onGrab(playerId) {
    const currentPlayerId: string = (this.scene as GameScene).uid!
    if (playerId === currentPlayerId) {
      this.circle.setStrokeStyle(2, 0x4cff00, 1)
      this.circle.setFillStyle(0x61738a, 1)
    } else if (playerId == "") {
      this.circle.setStrokeStyle(1, 0xffffff, 0.7)
      this.circle.setFillStyle(0x61738a, 1)
    } else {
      this.circle.setStrokeStyle(2, 0xcf0000, 0.7)
      this.circle.setFillStyle(0x61738a, 0.7)
    }
  }
}
