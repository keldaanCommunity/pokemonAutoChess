import {GameObjects} from 'phaser';
import Lifebar from './life-bar';
import Button from './button';
import PokemonDetail from './pokemon-detail';
import ItemContainer from './item-container';

export default class Pokemon extends Button {
  constructor(scene, x, y, pokemon, dragable, isPopup) {
    super(scene, x, y, 75, 75);
    this.isPopup = isPopup;
    this.objType = 'pokemon';
    this.height = 0;
    this.width = 0;
    this.index = pokemon.index;
    this.name = pokemon.name;
    this.id = pokemon.id;
    this.hp = pokemon.hp;
    this.range = pokemon.range;
    this.atk = pokemon.atk;
    this.def = pokemon.def;
    this.speDef = pokemon.speDef;
    this.attackType = pokemon.attackType;
    this.type = pokemon.type;
    this.atkSpeed = pokemon.atkSpeed;
    this.targetX = null;
    this.targetY = null;
    this.positionX = pokemon.positionX;
    this.positionY = pokemon.positionY;
    this.attackSprite = pokemon.attackSprite;
    this.setRangeType();
    this.setMovingFunction(scene);
    this.setParameters(pokemon);
    this.setSprite(pokemon, scene);
    if (dragable) {
      scene.input.setDraggable(this);
    }
    if (pokemon.life) {
      this.life = pokemon.life;
    }
    this.setDepth(5);
  }

  enterButtonHoverState() {
    if (!this.getFirst('objType', 'detail') && this.isPopup) {
      if (this.life) {
        this.add(new PokemonDetail(this.scene, 20, -170, this.name, this.life, this.atk, this.def, this.speDef, this.attackType, this.range, this.atkSpeed));
      } else {
        this.add(new PokemonDetail(this.scene, 20, -170, this.name, this.hp, this.atk, this.def, this.speDef, this.attackType, this.range, this.atkSpeed));
      }
    }
  }

  enterButtonRestState() {
    const detail = this.getFirst('objType', 'detail');
    if (detail) {
      this.remove(detail);
    }
  }

  enterButtonActiveState() {
  }

  attackAnimation() {
    let x;
    let y;
    if (this.range > 1) {
      x = this.positionX;
      y = this.positionY;
    } else {
      x = this.targetX;
      y = this.targetY;
    }
    const coordinates = window.transformAttackCoordinate(x, y);
    this.projectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'attacks', `${this.attackSprite}/000`);
    const scale = window.getAttackScale(this.attackSprite);
    this.projectile.setScale(scale[0], scale[1]);
    this.projectile.anims.play(`${this.attackSprite}`);
    this.addTween();
  }

  addTween() {
    const coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
    if (this.scene) {
      //console.log(`Shooting a projectile to (${this.targetX},${this.targetY})`);
      this.scene.tweens.add({
        targets: this.projectile,
        x: coordinates[0],
        y: coordinates[1],
        ease: 'Linear',
        duration: this.atkSpeed,
        onComplete: (tween, targets) => {
          targets[0].setVisible(false);
          if (this.checkAnimations()) {
            this.replayAnimations();
          } else {
            this.projectile.destroy();
          }
        }
      });
    } else {
      this.projectile.destroy();
    }
  }

  replayAnimations() {
    if (this) {
      let x;
      let y;
      if (this.range > 1) {
        x = this.positionX;
        y = this.positionY;
      } else {
        x = this.targetX;
        y = this.targetY;
      }
      const coordinates = window.transformAttackCoordinate(x, y);
      if (this.projectile.scene) {
        this.projectile.setPosition(coordinates[0], coordinates[1]);
        this.projectile.setVisible(true);
        this.projectile.setDepth(7);
        this.addTween();
      }
    } else {
      this.projectile.destroy();
    }
  }

  checkAnimations() {
    if (this.action == 'ATTACKING') {
      return true;
    } else {
      return false;
    }
  }

  setLifeBar(pokemon, scene, height) {
    if (pokemon.life) {
      let color;
      if (pokemon.team == 0) {
        color = 0x00ff00;
      } else {
        color = 0xff0000;
      }
      const lifebar = new Lifebar(scene, -15, height, pokemon.hp, color);
      lifebar.setLife(pokemon.life);
      this.add(lifebar);
    }
  }

  setEffects(pokemon, scene, height) {
    let c = 0;
    if (pokemon.effects.length > 0) {
      pokemon.effects.forEach((effect) => {
        const image = new GameObjects.Image(scene, c*20 - 20, height, 'effects', effect);
        const border = new GameObjects.Image(scene, c*20 - 20, height, 'effects', 'border');
        image.objType = 'effect';
        border.objType = 'effect';
        image.setScale(0.5, 0.5);
        border.setScale(0.5, 0.5);
        scene.add.existing(image);
        scene.add.existing(border);
        this.add(image);
        this.add(border);
        c+= 1;
      });
    }
  }

  setSprite(pokemon, scene) {
    const sprite = new GameObjects.Sprite(scene, 0, 0, pokemon.sheet, `${pokemon.index}/0/1/0`);
    this.height = sprite.height;
    this.width = sprite.width;
    sprite.setScale(2, 2);
    const socle = new GameObjects.Image(scene, 0, this.height, 'socle');
    socle.objType = 'socle';
    sprite.objType = 'sprite';
    scene.add.existing(socle);
    scene.add.existing(sprite);
    this.add(socle);
    this.add(sprite);
    this.setLifeBar(pokemon, scene, this.height/2 + 5);
    this.setItems(pokemon, scene);
    if (pokemon.effects) {
      this.setEffects(pokemon, scene, this.height + 30);
    }
  }

  setItem0(item){
    if(this.item0){
      this.remove(this.item0);
    }
    this.item0 = new ItemContainer(this.scene,this.width + 15, this.height - 50, item, false, 'item0');
    this.scene.add.existing(item);
    this.add(this.item0);
  }

  setItem1(item){
    if(this.item1){
      this.remove(this.item1);
    }
    this.item1 = new ItemContainer(this.scene,this.width + 15, this.height - 20, item, false, 'item1');
    this.scene.add.existing(this.item1);
    this.add(this.item1);
  }

  setItem2(item){
    if(this.item2){
      this.remove(this.item2);
    }
    this.item2 = new ItemContainer(this.scene,this.width + 15, this.height + 10, item, false, 'item2');
    this.scene.add.existing(this.item2);
    this.add(this.item2);
  }

  setItems(pokemon){
    
    if(pokemon.items.item0 && pokemon.items.item0 != ''){
      this.setItem0(pokemon.items.item0);
    }
    if(pokemon.items.item1 && pokemon.items.item1 != ''){
      this.setItem1(pokemon.items.item1);
    }
    if(pokemon.items.item2 && pokemon.items.item2 != ''){
      this.setItem2(pokemon.items.item2);
    }
  }

  setParameters(pokemon) {
    if (pokemon.orientation) {
      this.orientation = pokemon.orientation;
    } else {
      this.orientation = 'DOWNLEFT';
    }
    if (pokemon.action) {
      this.action = pokemon.action;
    } else {
      this.action = 'MOVING';
    }
  }

  setMovingFunction(scene) {
    this.moveManager = scene.plugins.get('rexMoveTo').add(this, {
      speed: 300,
      rotateToTarget: false
    });
  }

  setRangeType() {
    if (this.range > 1) {
      this.rangeType = 'range';
    } else {
      this.rangeType = 'melee';
    }
  }
}
