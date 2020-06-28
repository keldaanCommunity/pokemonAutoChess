import { GameObjects } from "phaser";
import Button from "./button";

export default class RefreshButton extends Button {
  constructor(scene, x, y) {
    super(scene, x, y, 200, 50);
    this.textStyle = {
      fontSize: "20px",
      fontFamily: "Verdana",
      color: "white",
      align: "center"
    };

    let graphics = new GameObjects.Graphics(scene);
    let color = 0xffffff;
    let thickness = 1;
    let alpha = 1;
    graphics.lineStyle(thickness, color, alpha);
    graphics.strokeRect(-100, -25, 200, 50);

    this.add(new GameObjects.Rectangle(scene, 0, 0, 200, 50, 0x293942));
    this.add(graphics);
    this.add(new GameObjects.Text(scene, -40, -10, "Refresh", this.textStyle));
    this.add(new GameObjects.Text(scene, 55, -20, "2", this.textStyle));
    this.add(new GameObjects.Image(scene, 85, -10, "money").setScale(0.5, 0.5));
  }

  enterButtonHoverState() {
  }

  enterButtonRestState() {
  }

  enterButtonActiveState() {
    window.dispatchEvent(new CustomEvent("refresh-click"));
  }

}