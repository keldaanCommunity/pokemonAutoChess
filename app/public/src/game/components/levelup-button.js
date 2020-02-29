import { GameObjects } from "phaser";
import Button from "./button";


export default class PlayButton extends Button {
  constructor(scene, x, y) {
    super(scene, x, y, 108, 108);
    this.background = new GameObjects.Image(scene, 0, 0, "playButton");
    this.add(this.background);
  }

  enterButtonHoverState() {

  }

  enterButtonRestState() {
    
  }

  enterButtonActiveState() {
    window.dispatchEvent(new CustomEvent("clickPlay"));
  }

}