import { GameObjects } from "phaser";
import Button from "./button";

export default class LockButton extends Button {
  constructor(scene, x, y) {
    super(scene, x, y, 50, 50);
    this.textStyle = {
      fontSize: "20px",
      fontFamily: "Verdana",
      color: "white",
      align: "center"
    };
    this.lock = new GameObjects.Image(scene, 0, 0, "lock","unlocked").setScale(0.5,0.5);
    this.add(this.lock);

    let graphics = new GameObjects.Graphics(scene);
    let color = 0xffffff;
    let thickness = 1;
    let alpha = 1;
    graphics.lineStyle(thickness, color, alpha);
    graphics.strokeRect(-25, -25, 50, 50);
    this.add(graphics);

    this.updateState();
  }

  enterButtonHoverState() {
  }

  enterButtonRestState() {
  }

  enterButtonActiveState() {
    window.dispatchEvent(new CustomEvent("lock-click"));
  }

  updateState(){
    
    if(window.state.players[window.sessionId].shopLocked){
      this.lock.setTexture("lock", "locked");
    }
    else{
      this.lock.setTexture("lock","unlocked");
    }
  }

}