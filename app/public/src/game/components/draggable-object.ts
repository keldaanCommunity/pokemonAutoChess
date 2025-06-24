import { GameObjects } from "phaser"

export default class DraggableObject extends GameObjects.Container {
  dragDisabled: boolean

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    dragDisabled: boolean = false
  ) {
    super(scene, x, y)
    this.dragDisabled = dragDisabled
    this.setSize(width, height)

    this.setInteractive()
      .on("pointerover", (pointer: Phaser.Input.Pointer) => {
        this.onPointerOver(pointer)
      })
      .on("pointerout", () => this.onPointerOut())
      .on(
        "pointerdown",
        (
          pointer: Phaser.Input.Pointer,
          _x: number,
          _y: number,
          event: Phaser.Types.Input.EventData
        ) => {
          this.onPointerDown(pointer, event)
        }
      )
      .on("pointerup", () => this.onPointerUp())

    /* DEBUG HITBOX AREAS
    scene.input.enableDebug(this, 0x00ff00);
    // AFTER enabling debug, access the debug graphic and set its depth
    if (this.input && this.input.hitAreaDebug) {
      this.input.hitAreaDebug.setDepth(100); // Set a high depth value
      console.log("Debug graphic created and depth set.");
    } else {
      console.warn("Debug graphic not found on sprite after enableDebug.");
    }
    */

    this.scene.add.existing(this)
  }

  get draggable(): boolean {
    return !this.dragDisabled
  }

  set draggable(isDraggable: boolean) {
    this.dragDisabled = !isDraggable
    this.scene.input.setDraggable(this, isDraggable)
  }

  onPointerOver(pointer) {
    if (!this.dragDisabled) {
      document.body.classList.add("grab")
    }
  }

  onPointerOut() {
    if (!this.dragDisabled) {
      document.body.classList.remove("grab")
    }
  }

  onPointerDown(pointer, event) {
    if (!this.dragDisabled) {
      document.body.classList.add("grabbing")
    }
  }

  onPointerUp() {
    if (!this.dragDisabled) {
      document.body.classList.remove("grabbing")
      document.body.classList.add(
        "grab"
      ) /* if it was grabbing, should still be over target when releasing */
    }
  }
}
