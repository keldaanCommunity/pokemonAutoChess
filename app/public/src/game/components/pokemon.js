import {GameObjects} from 'phaser';
import Lifebar from './life-bar';
import Button from './button';
import PokemonDetail from './pokemon-detail';

export default class Pokemon extends Button {
  constructor(scene, x, y, pokemon, dragable) {
    super(scene, x, y, 75, 75);
    this.index = pokemon.index;
    this.name = pokemon.name;
    this.id = pokemon.id;
    this.range = pokemon.range;
    this.type = pokemon.type;
    this.targetX = null;
    this.targetY = null;
    this.positionX = pokemon.positionX;
    this.positionY = pokemon.positionY;
    this.attackSprite = pokemon.attackSprite;
    this.setRangeType();
    this.setMovingFunction(scene);
    this.setParameters(pokemon);
    this.setSprite(pokemon, scene);
    this.setLifeBar(pokemon, scene);
    if (dragable) {
      scene.input.setDraggable(this);
    }
  }

  enterButtonHoverState() {
    console.log('hover');
    if (!this.getFirst('objType', 'detail')) {
      this.add(new PokemonDetail(this.scene, 20, -130, this.name));
    }
  }

  enterButtonRestState() {
    console.log('rest');
    const detail = this.getFirst('objType', 'detail');
    console.log(detail);
    if (detail) {
      console.log('remove detail');
      this.remove(detail);
    }
  }

  enterButtonActiveState() {
    console.log('active');
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
      // console.log(`Shooting a projectile to (${this.targetX},${this.targetY})`);
      this.scene.tweens.add({
        targets: this.projectile,
        x: coordinates[0],
        y: coordinates[1],
        ease: 'Linear',
        duration: 1000,
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
      this.projectile.setPosition(coordinates[0], coordinates[1]);
      this.projectile.setVisible(true);
      this.addTween();
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

  setLifeBar(pokemon, scene) {
    if (pokemon.life) {
      let color;
      if (pokemon.team == 0) {
        color = 0x00ff00;
      } else {
        color = 0xff0000;
      }
      const lifebar = new Lifebar(scene, -15, 13, pokemon.life, color);
      this.add(lifebar);
    }
  }

  setSprite(pokemon, scene) {
    const sprite = new GameObjects.Sprite(scene, 0, 0, `${pokemon.rarity}`, `${pokemon.index}/0/1/0`);
    sprite.setScale(3, 3);
    sprite.objType = 'sprite';
    scene.add.existing(sprite);
    this.add(sprite);
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
