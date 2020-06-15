import { Physics } from "phaser";

export default class Pokemon extends Physics.Arcade.Sprite {
  constructor(scene, x, y, pokemon) {    
    super(scene, x, y, pokemon.index, pokemon.index + "/0/1/0");
    this.setScale(3, 3);
    this.index = pokemon.index;
    this.id = pokemon.id;
    this.positionX = pokemon.positionX;
    this.positionY = pokemon.positionY;
    if(pokemon.orientation){
      this.orientation = pokemon.orientation;
    }
    else{
      this.orientation = "DOWNRIGHT";
    }
    if(pokemon.action){
      this.action = pokemon.action;
    }
    else{
      this.action = "MOVING";
    }
    this.moveManager = scene.plugins.get('rexMoveTo').add(this, {
      speed: 300,
      rotateToTarget: false
  });
  }
}