import { Physics } from "phaser";
import MoveTo from 'phaser3-rex-plugins/plugins/moveto.js';

export default class Pokemon extends Physics.Arcade.Sprite {
  constructor(scene, x, y, pokemon) {    
    super(scene, x, y, pokemon.index, pokemon.index + "_0_1_0");
    this.setScale(3, 3);
    this.index = pokemon.index;
    this.id = pokemon.id;
    this.positionX = pokemon.positionX;
    this.positionY = pokemon.positionY;
    this.moveManager = scene.plugins.get('rexMoveTo').add(this, {
      speed: 400,
      rotateToTarget: false
  })
  }
}