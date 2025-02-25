import { GameObjects } from "phaser"
import { ISynergySymbol } from "../../../../types"
import { Synergy } from "../../../../types/enum/Synergy"
import { DEPTH } from "../depths"

export class Portal extends GameObjects.Container {
  sprite: GameObjects.Sprite
  id: string

  constructor(scene: Phaser.Scene, id: string, x: number, y: number) {
    super(scene, x, y)
    this.id = id
    this.sprite = new GameObjects.Sprite(scene, 0, 0, "portal")
    this.sprite.anims.play("portal")
    this.sprite.setScale(2)
    this.add(this.sprite)
    this.setDepth(DEPTH.INANIMATE_OBJECTS)
    this.scene.add.existing(this)
  }
}

export class SynergySymbol
  extends GameObjects.Sprite
  implements ISynergySymbol
{
  id: string
  synergy: Synergy

  constructor(
    scene: Phaser.Scene,
    id: string,
    x: number,
    y: number,
    synergy: Synergy
  ) {
    super(scene, x, y, "types", synergy + ".png")
    this.id = id
    this.synergy = synergy
    this.setDepth(DEPTH.INANIMATE_OBJECTS)
    this.scene.add.existing(this)
  }
}
