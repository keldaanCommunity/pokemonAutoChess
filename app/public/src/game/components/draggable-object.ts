/* eslint-disable @typescript-eslint/no-empty-function */
import { GameObjects } from "phaser"

export default class DraggableObject extends GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super(scene, x, y)
    this.setSize(width, height)
    this.setInteractive()
      .on("pointerover", () => this.onPointerOver())
      .on("pointerout", () => this.onPointerOut())
      .on("pointerdown", (pointer) => this.onPointerDown(pointer))
      .on("pointerup", () => this.onPointerUp())
    this.scene.add.existing(this)
  }

  onPointerOver() {
    document.body.classList.add("grab")
  }

  onPointerOut() {
    document.body.classList.remove("grab")
  }

  onPointerDown(pointer) {    
    document.body.classList.add("grabbing")
  }

  onPointerUp(){
    document.body.classList.remove("grabbing")
    document.body.classList.add("grab") /* if it was grabbing, should still be over target when releasing */
  }
}
