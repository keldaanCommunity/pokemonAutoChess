import { GameObjects } from "phaser";

export default class Button extends GameObjects.Container {
  constructor(scene, x, y, width, height) {
    super(scene, x, y);
    this.setSize(width, height);
    this.setInteractive({ useHandCursor: true })
      .on("pointerover", () => this.enterButtonHoverState())
      .on("pointerout", () => this.enterButtonRestState())
      .on("pointerdown", () => this.enterButtonActiveState())
      .on("pointerup", () => this.enterButtonHoverState());
    this.scene.add.existing(this);
  }

  enterButtonHoverState() {

  }

  enterButtonRestState() {

  }

  enterButtonActiveState() {

  }
}