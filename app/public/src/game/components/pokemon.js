import { GameObjects } from "phaser";
import Lifebar from "./life-bar";

export default class Pokemon extends GameObjects.Container {
  constructor(scene, x, y, pokemon) {    
    super(scene, x, y);
    this.index = pokemon.index;
    this.id = pokemon.id;
    this.positionX = pokemon.positionX;
    this.positionY = pokemon.positionY;
    this.setSize(50,50);

    let sprite = new GameObjects.Sprite(scene,0,0,"pokemons",`${pokemon.index}/0/1/0`);
    sprite.setScale(3, 3);
    scene.add.existing(sprite);
    this.add(sprite);

    if(pokemon.life){
      let color;
      if (pokemon.team == 0){
        color = 0x00ff00;
      }
      else{
        color = 0xff0000;
      }
      let lifebar = new Lifebar(scene, -15, 12, pokemon.life, color);
      this.add(lifebar);
    }

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
  scene.add.existing(this);
  }
}