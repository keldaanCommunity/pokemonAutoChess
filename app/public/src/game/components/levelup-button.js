import { GameObjects } from "phaser";
import Button from "./button";


export default class LevelUpButton extends Button {
  constructor(scene, x, y) {
    super(scene, x, y, 108, 108);
    this.background = new GameObjects.Image(scene, 0, 0, "levelUpButton");
    this.textStyle = {
      fontSize: "20px",
      fontFamily: "Verdana",
      color: "black",
      align: "center"
    };
    this.add(this.background);
    this.add(new GameObjects.Text(scene, 60, -25, "4", this.textStyle));
    this.add(new GameObjects.Image(scene, 90, -13, "money").setScale(0.5, 0.5));
  }

  enterButtonHoverState() {

  }

  enterButtonRestState() {
    
  }

  enterButtonActiveState() {
    window.dispatchEvent(new CustomEvent("level-click"));
  }

}