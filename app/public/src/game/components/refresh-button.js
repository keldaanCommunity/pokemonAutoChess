import { GameObjects } from "phaser";
import Button from "./button";

export default class RefreshButton extends Button {
  constructor(scene, x, y) {
    super(scene, x, y, 200, 50);
    this.background = new GameObjects.Image(scene, 0, 0, "refreshButton");
    this.add(this.background);
  }

  enterButtonHoverState() {
  }

  enterButtonRestState() {
  }

  enterButtonActiveState() {
    window.dispatchEvent(new CustomEvent("refreshClick"));
  }

}