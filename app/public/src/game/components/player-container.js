import { GameObjects } from "phaser";
import PlayerPortraitContainer from "./player-portrait-container";

export default class PlayerContainer extends GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.buildPlayerPortraits();
    scene.add.existing(this);
  }

  buildPlayerPortraits() {
    let i = 0;
    for (let id in window.state.players) {
      this.add(new PlayerPortraitContainer(this.scene, 0, 100 * i, window.state.players[id]));
      i += 1;
    }
  }

  updatePortraits() {
    this.removeAll();
    this.buildPlayerPortraits();
  }

}