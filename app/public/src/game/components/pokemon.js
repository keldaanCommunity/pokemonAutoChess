import {GameObjects} from 'phaser';
import Lifebar from './life-bar';
import Button from './button';
import PokemonDetail from './pokemon-detail';
import ItemContainer from './item-container';
//import pokemon from '../../../../models/pokemon';
import {SPECIAL_SKILL} from '../../../../models/enum.js';

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
    this.skill = pokemon.skill;
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

  specialAttackAnimation(){
    if(this.skill){
      let coordinates;
      let specialProjectile;
      let coordinatesTarget;

      switch (this.skill) {
        case SPECIAL_SKILL.FIRE_BLAST:
          coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
          specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.FIRE_BLAST}/000`);
          specialProjectile.setDepth(7);
          specialProjectile.setScale(2,2);
          specialProjectile.anims.play(SPECIAL_SKILL.FIRE_BLAST);
          specialProjectile.once('animationcomplete', () => {
            specialProjectile.destroy();
          });
          break;
        
        case SPECIAL_SKILL.WHEEL_OF_FIRE:
          coordinatesTarget = window.transformAttackCoordinate(this.targetX, this.targetY);
          coordinates = window.transformAttackCoordinate(this.positionX, this.positionY);
          specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.WHEEL_OF_FIRE}/000`);
          specialProjectile.setDepth(7);
          specialProjectile.setScale(2,2);
          specialProjectile.anims.play(SPECIAL_SKILL.WHEEL_OF_FIRE);
          this.scene.tweens.add({
            targets: specialProjectile,
            x: coordinatesTarget[0],
            y: coordinatesTarget[1],
            ease: 'Power2',
            yoyo: true,
            duration: 500,
            onComplete: (tween, targets) => {
              specialProjectile.destroy();
            }
          });
          break;

        case SPECIAL_SKILL.SEISMIC_TOSS:
          coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
          specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.SEISMIC_TOSS}/000`);
          specialProjectile.setDepth(7);
          specialProjectile.setScale(2,2);
          specialProjectile.anims.play(SPECIAL_SKILL.SEISMIC_TOSS);
          specialProjectile.once('animationcomplete', () => {
            specialProjectile.destroy();
          });
          break;
          
        case SPECIAL_SKILL.GUILLOTINE:
          coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
          specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.GUILLOTINE}/000`);
          specialProjectile.setDepth(7);
          specialProjectile.setScale(3,3);
          specialProjectile.anims.play(SPECIAL_SKILL.GUILLOTINE);
          specialProjectile.once('animationcomplete', () => {
            specialProjectile.destroy();
          });
          break;

        case SPECIAL_SKILL.ROCK_SLIDE:
          coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
          specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.ROCK_SLIDE}/000`);
          specialProjectile.setDepth(7);
          specialProjectile.setScale(2,2);
          specialProjectile.anims.play(SPECIAL_SKILL.ROCK_SLIDE);
          specialProjectile.once('animationcomplete', () => {
            specialProjectile.destroy();
          });
          break;

        case SPECIAL_SKILL.HEAT_WAVE:
          coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
          specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.HEAT_WAVE}/000`);
          specialProjectile.setDepth(7);
          specialProjectile.setScale(2,2);
          specialProjectile.anims.play(SPECIAL_SKILL.HEAT_WAVE);
          specialProjectile.once('animationcomplete', () => {
            specialProjectile.destroy();
          });
          break;

        case SPECIAL_SKILL.THUNDER:
          coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
          specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.THUNDER}/000`);
          specialProjectile.setDepth(7);
          specialProjectile.setScale(2,2);
          specialProjectile.anims.play(SPECIAL_SKILL.THUNDER);
          specialProjectile.once('animationcomplete', () => {
            specialProjectile.destroy();
          });
          break;

        case SPECIAL_SKILL.HYDRO_PUMP:
          coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
          specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.HYDRO_PUMP}/000`);
          specialProjectile.setDepth(7);
          specialProjectile.setScale(2,2);
          specialProjectile.anims.play(SPECIAL_SKILL.HYDRO_PUMP);
          specialProjectile.once('animationcomplete', () => {
            specialProjectile.destroy();
          });
          break;

        case SPECIAL_SKILL.DRACO_METEOR:
          coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
          specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.DRACO_METEOR}/000`);
          specialProjectile.setDepth(7);
          specialProjectile.setScale(2,2);
          specialProjectile.anims.play(SPECIAL_SKILL.DRACO_METEOR);
          specialProjectile.once('animationcomplete', () => {
            specialProjectile.destroy();
          });
          break;

        case SPECIAL_SKILL.BLAZE_KICK:
          coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
          specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.BLAZE_KICK}/000`);
          specialProjectile.setDepth(7);
          specialProjectile.setScale(2,2);
          specialProjectile.anims.play(SPECIAL_SKILL.BLAZE_KICK);
          specialProjectile.once('animationcomplete', () => {
            specialProjectile.destroy();
          });
          break;

        case SPECIAL_SKILL.WISH:
          coordinates = window.transformAttackCoordinate(this.positionX, this.positionY);
          specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.WISH}/000`);
          specialProjectile.setDepth(7);
          specialProjectile.setScale(3,3);
          specialProjectile.anims.play(SPECIAL_SKILL.WISH);
          specialProjectile.once('animationcomplete', () => {
            specialProjectile.destroy();
          });
          break;
          
      case SPECIAL_SKILL.CALM_MIND:
        coordinates = window.transformAttackCoordinate(this.positionX, this.positionY);
        specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.CALM_MIND}/000`);
        specialProjectile.setDepth(7);
        specialProjectile.setScale(2,2);
        specialProjectile.anims.play(SPECIAL_SKILL.CALM_MIND);
        specialProjectile.once('animationcomplete', () => {
          specialProjectile.destroy();
        });
        break;

      case SPECIAL_SKILL.IRON_DEFENSE:
        coordinates = window.transformAttackCoordinate(this.positionX, this.positionY);
        specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.IRON_DEFENSE}/000`);
        specialProjectile.setDepth(7);
        specialProjectile.setScale(2,2);
        specialProjectile.anims.play(SPECIAL_SKILL.IRON_DEFENSE);
        specialProjectile.once('animationcomplete', () => {
          specialProjectile.destroy();
        });
        break;

      case SPECIAL_SKILL.METRONOME:
        coordinates = window.transformAttackCoordinate(this.positionX, this.positionY);
        specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.METRONOME}/000`);
        specialProjectile.setDepth(7);
        specialProjectile.setScale(2,2);
        specialProjectile.anims.play(SPECIAL_SKILL.METRONOME);
        specialProjectile.once('animationcomplete', () => {
          specialProjectile.destroy();
        });
        break;

      case SPECIAL_SKILL.SOAK:
        coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
        specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.SOAK}/000`);
        specialProjectile.setDepth(7);
        specialProjectile.setScale(2,2);
        specialProjectile.anims.play(SPECIAL_SKILL.SOAK);
        specialProjectile.once('animationcomplete', () => {
          specialProjectile.destroy();
        });
        break;

      case SPECIAL_SKILL.IRON_TAIL:
        coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
        specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.IRON_TAIL}/000`);
        specialProjectile.setDepth(7);
        specialProjectile.setScale(2,2);
        specialProjectile.anims.play(SPECIAL_SKILL.IRON_TAIL);
        specialProjectile.once('animationcomplete', () => {
          specialProjectile.destroy();
        });
        break;

      case SPECIAL_SKILL.BLAST_BURN:
        coordinates = window.transformAttackCoordinate(this.positionX, this.positionY);
        specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.BLAST_BURN}/000`);
        specialProjectile.setDepth(7);
        specialProjectile.setScale(3,3);
        specialProjectile.anims.play(SPECIAL_SKILL.BLAST_BURN);
        specialProjectile.once('animationcomplete', () => {
          specialProjectile.destroy();
        });
        break;

      case SPECIAL_SKILL.CHARGE:
        coordinates = window.transformAttackCoordinate(this.positionX, this.positionY);
        specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.CHARGE}/000`);
        specialProjectile.setDepth(7);
        specialProjectile.setScale(2,2);
        specialProjectile.anims.play(SPECIAL_SKILL.CHARGE);
        specialProjectile.once('animationcomplete', () => {
          specialProjectile.destroy();
        });
        break;

      case SPECIAL_SKILL.DISCHARGE:
        coordinates = window.transformAttackCoordinate(this.positionX, this.positionY);
        specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.DISCHARGE}/000`);
        specialProjectile.setDepth(7);
        specialProjectile.setScale(3,3);
        specialProjectile.anims.play(SPECIAL_SKILL.DISCHARGE);
        specialProjectile.once('animationcomplete', () => {
          specialProjectile.destroy();
        });
        break;
      
      case SPECIAL_SKILL.BITE:
        coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
        specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.BITE}/000`);
        specialProjectile.setDepth(7);
        specialProjectile.setScale(2,2);
        specialProjectile.anims.play(SPECIAL_SKILL.BITE);
        specialProjectile.once('animationcomplete', () => {
          specialProjectile.destroy();
        });
        break;

      case SPECIAL_SKILL.DRAGON_TAIL:
        coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
        specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.DRAGON_TAIL}/000`);
        specialProjectile.setDepth(7);
        specialProjectile.setScale(2,2);
        specialProjectile.anims.play(SPECIAL_SKILL.DRAGON_TAIL);
        specialProjectile.once('animationcomplete', () => {
          specialProjectile.destroy();
        });
        break;

      case SPECIAL_SKILL.DRAGON_BREATH:
        coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
        specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.DRAGON_BREATH}/000`);
        specialProjectile.setDepth(7);
        specialProjectile.setScale(2,2);
        specialProjectile.anims.play(SPECIAL_SKILL.DRAGON_BREATH);
        specialProjectile.once('animationcomplete', () => {
          specialProjectile.destroy();
        });
        break;
        
        case SPECIAL_SKILL.ICICLE_CRASH:
          coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
          specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.ICICLE_CRASH}/000`);
          specialProjectile.setDepth(7);
          specialProjectile.setScale(3,3);
          specialProjectile.anims.play(SPECIAL_SKILL.ICICLE_CRASH);
          specialProjectile.once('animationcomplete', () => {
            specialProjectile.destroy();
          });
          break;

        case SPECIAL_SKILL.ROOT:
          coordinates = window.transformAttackCoordinate(this.positionX, this.positionY);
          specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.ROOT}/000`);
          specialProjectile.setDepth(7);
          specialProjectile.setScale(2,2);
          specialProjectile.anims.play(SPECIAL_SKILL.ROOT);
          specialProjectile.once('animationcomplete', () => {
            specialProjectile.destroy();
          });
          break;

        case SPECIAL_SKILL.TORMENT:
          coordinates = window.transformAttackCoordinate(this.positionX, this.positionY);
          specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.TORMENT}/000`);
          specialProjectile.setDepth(7);
          specialProjectile.setScale(2,2);
          specialProjectile.anims.play(SPECIAL_SKILL.TORMENT);
          specialProjectile.once('animationcomplete', () => {
            specialProjectile.destroy();
          });
          break;

        case SPECIAL_SKILL.STOMP:
          coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
          specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.STOMP}/000`);
          specialProjectile.setDepth(7);
          specialProjectile.setScale(3,3);
          specialProjectile.anims.play(SPECIAL_SKILL.STOMP);
          specialProjectile.once('animationcomplete', () => {
            specialProjectile.destroy();
          });
          break;

        case SPECIAL_SKILL.DARK_PULSE:
          coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
          specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.DARK_PULSE}/000`);
          specialProjectile.setDepth(7);
          specialProjectile.setScale(2,2);
          specialProjectile.anims.play(SPECIAL_SKILL.DARK_PULSE);
          specialProjectile.once('animationcomplete', () => {
            specialProjectile.destroy();
          });
          break;

        case SPECIAL_SKILL.NIGHT_SLASH:
          coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
          specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.NIGHT_SLASH}/000`);
          specialProjectile.setDepth(7);
          specialProjectile.setScale(2,2);
          specialProjectile.anims.play(SPECIAL_SKILL.NIGHT_SLASH);
          specialProjectile.once('animationcomplete', () => {
            specialProjectile.destroy();
          });
          break;

        case SPECIAL_SKILL.BUG_BUZZ:
          coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
          specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.BUG_BUZZ}/000`);
          specialProjectile.setDepth(7);
          specialProjectile.setScale(2,2);
          specialProjectile.anims.play(SPECIAL_SKILL.BUG_BUZZ);
          specialProjectile.once('animationcomplete', () => {
            specialProjectile.destroy();
          });
          break;

        case SPECIAL_SKILL.POISON_STING:
          coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
          specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.POISON_STING}/000`);
          specialProjectile.setDepth(7);
          specialProjectile.setScale(2,2);
          specialProjectile.anims.play(SPECIAL_SKILL.POISON_STING);
          specialProjectile.once('animationcomplete', () => {
            specialProjectile.destroy();
          });
          break;

        case SPECIAL_SKILL.LEECH_LIFE:
          coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
          specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.LEECH_LIFE}/000`);
          specialProjectile.setDepth(7);
          specialProjectile.setScale(2,2);
          specialProjectile.anims.play(SPECIAL_SKILL.LEECH_LIFE);
          specialProjectile.once('animationcomplete', () => {
            specialProjectile.destroy();
          });
          break;      

        case SPECIAL_SKILL.HAPPY_HOUR:
          coordinates = window.transformAttackCoordinate(this.positionX, this.positionY);
          specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.HAPPY_HOUR}/000`);
          specialProjectile.setDepth(7);
          specialProjectile.setScale(2,2);
          specialProjectile.anims.play(SPECIAL_SKILL.HAPPY_HOUR);
          specialProjectile.once('animationcomplete', () => {
            specialProjectile.destroy();
          });
          break;

          case SPECIAL_SKILL.TELEPORT:
            coordinates = window.transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.TELEPORT}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2,2);
            specialProjectile.anims.play(SPECIAL_SKILL.TELEPORT);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.NASTY_PLOT:
            coordinates = window.transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.NASTY_PLOT}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2,2);
            specialProjectile.anims.play(SPECIAL_SKILL.NASTY_PLOT);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.THIEF:
            coordinates = window.transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.THIEF}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2,2);
            specialProjectile.anims.play(SPECIAL_SKILL.THIEF);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.STUN_SPORE:
            coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.STUN_SPORE}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2,2);
            specialProjectile.anims.play(SPECIAL_SKILL.STUN_SPORE);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.METEOR_MASH:
            coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.METEOR_MASH}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(3,3);
            specialProjectile.anims.play(SPECIAL_SKILL.METEOR_MASH);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.HURRICANE:
            coordinates = window.transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.HURRICANE}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2,2);
            specialProjectile.anims.play(SPECIAL_SKILL.HURRICANE);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;
          default:
            break;
      }
    }
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
    if (pokemon.life !== undefined) {
      let color;
      if (pokemon.team == 0) {
        color = 0x00ff00;
      } else {
        color = 0xff0000;
      }
      const lifebar = new Lifebar(scene, -15, height, pokemon.hp, color, 'lifebar');
      lifebar.setLife(pokemon.life);
      this.add(lifebar);
    }
  }

  setManaBar(pokemon, scene, height) {
    if (pokemon.mana !== undefined) {
      let color = 0x01b8fe;
      const manabar = new Lifebar(scene, -15, height + 5, pokemon.maxMana, color, 'manabar');
      manabar.setLife(pokemon.mana);
      this.add(manabar);
    }
  }

  setEffects(pokemon, scene, height) {
    let c = 0;
    if (pokemon.effects.length > 0) {
      pokemon.effects.forEach((effect) => {
        const image = new GameObjects.Image(scene, c*20 - 20, height + 10, 'effects', effect);
        const border = new GameObjects.Image(scene, c*20 - 20, height + 10, 'effects', 'border');
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
    this.setManaBar(pokemon, scene, this.height/2 + 5);
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
