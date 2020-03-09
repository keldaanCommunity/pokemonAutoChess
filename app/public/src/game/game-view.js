import { Game, CANVAS, Scale } from "phaser";
import GameScene from "./scenes/game-scene";

export default class Gameview {
  constructor() {
    var config = {
      type: CANVAS,
      width: 2000,
      height: 1000,
      pixelArt: true,
      scene: [GameScene],
      scale: {
        mode: Scale.FIT
      }
    };
    this.game = new Game(config);
  }
}