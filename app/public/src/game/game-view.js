import { Game, CANVAS, Scale } from "phaser";
import LoginScene from "./scenes/login-scene";
import GameScene from "./scenes/game-scene";

export default class Gameview {
  constructor() {
    var config = {
      type: CANVAS,
      width: 2000,
      height: 1000,
      pixelArt: true,
      scene: [LoginScene, GameScene],
      scale: {
        mode: Scale.FIT
      }
    };
    this.game = new Game(config);
  }
}