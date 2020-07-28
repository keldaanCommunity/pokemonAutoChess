import { GameObjects } from "phaser";
import Lifebar from "./life-bar";

export default class Pokemon extends GameObjects.Container {
  constructor(scene, x, y, pokemon, dragable) {    
    super(scene, x, y);
    this.index = pokemon.index;
    this.id = pokemon.id;
    this.range = pokemon.range;
    this.type = pokemon.type;
    this.targetX = null;
    this.targetY = null;
    this.positionX = pokemon.positionX;
    this.positionY = pokemon.positionY;
    this.attackSprite = pokemon.attackSprite;
    this.setRangeType();
    this.setSize(75,75);
    this.setMovingFunction(scene);
    this.setParameters(pokemon);
    this.setSprite(pokemon, scene);
    this.setLifeBar(pokemon, scene);
    this.setInteractive({ useHandCursor: true });
    if(dragable){
      scene.input.setDraggable(this);
    }
    scene.add.existing(this);
  }

  attackAnimation(){
    let x;
    let y;
    if(this.range > 1){
      x = this.positionX;
      y = this.positionY;
    }
    else{
      x = this.targetX;
      y = this.targetY;
    }
    let coordinates = window.transformAttackCoordinate(x,y);
    this.projectile = this.scene.add.sprite(coordinates[0], coordinates[1], "attacks",`${this.attackSprite}/000`);
    let scale = window.getAttackScale(this.attackSprite);
    this.projectile.setScale(scale[0], scale[1]);
    this.projectile.anims.play(`${this.attackSprite}`);
    this.addTween();
  }

  addTween(){
    let self = this;
    let coordinates = window.transformAttackCoordinate(this.targetX,this.targetY);
    if(this.scene){
      //console.log(`Shooting a projectile to (${this.targetX},${this.targetY})`);
      this.scene.tweens.add({
        targets: this.projectile,
        x: coordinates[0],
        y: coordinates[1],
        ease: 'Linear',
        duration: 1000,
        onComplete: function (tween, targets) {
            targets[0].setVisible(false);
            if(self.checkAnimations()){
              self.replayAnimations();
            }
            else{
              self.projectile.destroy();
            }
        }
    });
    }
    else{
      this.projectile.destroy();
    }
  }

  replayAnimations(){
    if(this.first){
      let x;
      let y;
      if(this.range > 1){
        x = this.positionX;
        y = this.positionY;
      }
      else{
        x = this.targetX;
        y = this.targetY;
      }
      let coordinates = window.transformAttackCoordinate(x,y);
      this.projectile.setPosition(coordinates[0], coordinates[1]);
      this.projectile.setVisible(true);
      this.addTween();
    }
    else{
      this.projectile.destroy();
    }
  }

  checkAnimations(){
    if(this.action == "ATTACKING"){
      return true;
    }
    else{
      return false;
    }
  }

  setLifeBar(pokemon, scene){
    if(pokemon.life){
      let color;
      if (pokemon.team == 0){
        color = 0x00ff00;
      }
      else{
        color = 0xff0000;
      }
      let lifebar = new Lifebar(scene, -15, 13, pokemon.life, color);
      this.add(lifebar);
    }
  }

  setSprite(pokemon, scene){
    let sprite = new GameObjects.Sprite(scene,0,0,`${pokemon.rarity}`,`${pokemon.index}/0/1/0`);
    sprite.setScale(3, 3);
    scene.add.existing(sprite);
    this.add(sprite);
  }

  setParameters(pokemon){
    if(pokemon.orientation){
      this.orientation = pokemon.orientation;
    }
    else{
      this.orientation = "DOWNLEFT";
    }
    if(pokemon.action){
      this.action = pokemon.action;
    }
    else{
      this.action = "MOVING";
    }
  }

  setMovingFunction(scene){ 
    this.moveManager = scene.plugins.get('rexMoveTo').add(this, {
      speed: 300,
      rotateToTarget: false
  });
  }

  setRangeType(){
    if(this.range > 1){
      this.rangeType = "range";
    }
    else{
      this.rangeType = "melee";
    }
  }
}