import { GameObjects } from "phaser"
import { Synergy } from "../../../../types/enum/Synergy"
import GameScene from "../scenes/game-scene"

export class Portal extends GameObjects.Container {
  sprite: GameObjects.Sprite
  id: string

  constructor(
    scene: Phaser.Scene,
    id: string,
    x: number,
    y: number,
    symbols: Synergy[]
  ) {
    super(scene, x, y)
    this.id = id
    this.sprite = new GameObjects.Sprite(scene, 0, 0, "portal")
    this.sprite.anims.play("portal")
    this.sprite.setScale(2)
    this.add(this.sprite)
    this.scene.add.existing(this)

    for (let symbol of symbols) {
      //TODO: draw symbols
    }
  }

  update(...args: any[]): void {
    //TODO: rotate symbols in the portal
  }

  onGrab(playerId) {
    const currentPlayerId: string = (this.scene as GameScene).uid!
  }
}
