import { GameObjects } from "phaser"
import { Item } from "../../../../types/enum/Item"
import GameScene from "../scenes/game-scene"

export class FloatingItem extends GameObjects.Container {
  circle: GameObjects.Ellipse
  sprite: GameObjects.Image
  id: string
  constructor(
    scene: Phaser.Scene,
    id: string,
    x: number,
    y: number,
    name: Item
  ) {
    super(scene, x, y)
    this.name = name
    this.id = id
    this.circle = new GameObjects.Ellipse(scene, 0, 0, 30, 30, 0x61738a, 1)
    this.circle.setStrokeStyle(1, 0xffffff, 0.7)
    this.add(this.circle)
    this.sprite = new GameObjects.Image(scene, 0, 0, "item", this.name)
    this.add(this.sprite)
    this.scene.add.existing(this)
  }

  onGrab(playerId){
    const currentPlayerId: string = (this.scene as GameScene).uid!
    if(playerId === currentPlayerId){
      this.circle.setStrokeStyle(2, 0x4CFF00, 1)
      this.circle.setFillStyle(0x61738a, 1)
    } else if(playerId == ""){
      this.circle.setStrokeStyle(1, 0xffffff, 0.7)
      this.circle.setFillStyle(0x61738a, 1)
    } else {
      this.circle.setStrokeStyle(2, 0xCF0000, 0.7)
      this.circle.setFillStyle(0x61738a, 0.7) 
    }
  }
}
