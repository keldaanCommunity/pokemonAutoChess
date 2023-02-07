/* eslint-disable @typescript-eslint/no-empty-function */
import { GameObjects } from "phaser"

export default class DraggableObject extends GameObjects.Container {
  isDisabled: boolean;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    isDisabled: boolean = false
  ) {
    super(scene, x, y)
    this.isDisabled = isDisabled
    this.setSize(width, height)    
    this.setInteractive()
      .on("pointerover", () => this.onPointerOver())
      .on("pointerout", () => this.onPointerOut())
      .on("pointerdown", (pointer) => this.onPointerDown(pointer))
      .on("pointerup", () => this.onPointerUp())
    this.scene.add.existing(this)
  }

  onPointerOver() {
    if(!this.isDisabled){
      document.body.classList.add("grab")
    }
  }

  onPointerOut() {
    if(!this.isDisabled){
      document.body.classList.remove("grab")
    }
  }

  onPointerDown(pointer) {  
    if(!this.isDisabled){  
      document.body.classList.add("grabbing")
    }
  }

  onPointerUp(){
    if(!this.isDisabled){
      document.body.classList.remove("grabbing")
      document.body.classList.add("grab") /* if it was grabbing, should still be over target when releasing */
    }
  }
}
