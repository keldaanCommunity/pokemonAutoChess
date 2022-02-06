import {GameObjects} from 'phaser';
import Lifebar from './life-bar';
import Button from './button';
import PokemonDetail from './pokemon-detail';
import ItemContainer from './item-container';
import {SPECIAL_SKILL, EFFECTS_ICON, EFFECTS} from '../../../../models/enum.js';
import {transformAttackCoordinate, getAttackScale} from '../../pages/utils/utils';

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
    this.critChance = 10;
    this.atk = pokemon.atk;
    this.def = pokemon.def;
    this.speDef = pokemon.speDef;
    this.attackType = pokemon.attackType;
    this.type = pokemon.type;
    this.atkSpeed = pokemon.atkSpeed ? Number(pokemon.atkSpeed.toFixed(2)): 0.75;
    this.targetX = null;
    this.targetY = null;
    this.skill = pokemon.skill;
    this.positionX = pokemon.positionX;
    this.positionY = pokemon.positionY;
    this.attackSprite = pokemon.attackSprite;
    this.team = pokemon.team;
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
    if (pokemon.shield) {
      this.shield = pokemon.shield;
    }
    if (pokemon.critChance) {
      this.critChance = pokemon.critChance;
    }
    this.setDepth(5);
  }

  enterButtonHoverState() {
    if (!this.getFirst('objType', 'detail') && this.isPopup) {
      if (this.life) {
        this.add(new PokemonDetail(this.scene, 40, -200, this.name, this.life, this.atk, this.def, this.speDef, this.attackType, this.range, this.atkSpeed.toFixed(2), this.critChance));
      } else {
        this.add(new PokemonDetail(this.scene, 40, -200, this.name, this.hp, this.atk, this.def, this.speDef, this.attackType, this.range, this.atkSpeed.toFixed(2), this.critChance));
      }
    }
  }

  enterButtonRestState() {
    const detail = this.getFirst('objType', 'detail');
    if (detail) {
      this.remove(detail, true);
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
    const coordinates = transformAttackCoordinate(x, y);
    if (this.projectile) {
      this.projectile.destroy();
    }

    this.projectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'attacks', `${this.attackSprite}/000`);
    const scale = getAttackScale(this.attackSprite);
    this.projectile.setScale(scale[0], scale[1]);
    this.projectile.anims.play(`${this.attackSprite}`);
    this.addTween();
  }

  petalDanceAnimation() {
    const coordinates = transformAttackCoordinate(this.positionX, this.positionY);
    const specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], SPECIAL_SKILL.PETAL_DANCE, '000');
    specialProjectile.setDepth(7);
    specialProjectile.setScale(2, 2);
    specialProjectile.anims.play(SPECIAL_SKILL.PETAL_DANCE);
    specialProjectile.once('animationcomplete', () => {
      specialProjectile.destroy();
    });
  }

  fieldDeathAnimation() {
    const coordinates = transformAttackCoordinate(this.positionX, this.positionY);
    const specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'FIELD_DEATH', '000');
    specialProjectile.setDepth(7);
    specialProjectile.setScale(2, 2);
    specialProjectile.anims.play('FIELD_DEATH');
    specialProjectile.once('animationcomplete', () => {
      specialProjectile.destroy();
    });
  }

  fairyCritAnimation() {
    const coordinates = transformAttackCoordinate(this.positionX, this.positionY);
    const specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'FAIRY_CRIT', '000');
    specialProjectile.setDepth(7);
    specialProjectile.setScale(2, 2);
    specialProjectile.anims.play('FAIRY_CRIT');
    specialProjectile.once('animationcomplete', () => {
      specialProjectile.destroy();
    });
  }

  soundAnimation() {
    const coordinates = transformAttackCoordinate(this.positionX, this.positionY);
    const specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'ECHO', '000');
    specialProjectile.setDepth(7);
    specialProjectile.setScale(2, 2);
    specialProjectile.anims.play('ECHO');
    specialProjectile.once('animationcomplete', () => {
      specialProjectile.destroy();
    });
  }

  growGroundAnimation() {
    const coordinates = transformAttackCoordinate(this.positionX, this.positionY);
    const specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'attacks', 'GROUND/cell/000');
    specialProjectile.setDepth(7);
    specialProjectile.setScale(1.5, 1.5);
    specialProjectile.anims.play('ground-grow');
    specialProjectile.once('animationcomplete', () => {
      specialProjectile.destroy();
    });
  }

  deathAnimation() {
    // const sprite = this.getFirst('objType', 'sprite');
    this.life = 0;
    this.getFirst('objType', 'lifebar').setLife(this.life);
    const detail = this.getFirst('objType', 'detail');
    if (detail) {
      detail.hp.setText(0);
    }

    this.scene.add.tween({
      targets: [this],
      ease: 'Linear',
      duration: 1000,
      delay: 0,
      alpha: {
        getStart: () => 1,
        getEnd: () => 0
      },
      onComplete: () => {
        this.destroy(true);
      }
    });
  }

  specialAttackAnimation(group) {
    if (this.skill) {
      let coordinates;
      let specialProjectile;
      let coordinatesTarget;

      if (this.targetX != -1 && this.targetY != -1) {
        switch (this.skill) {
          case SPECIAL_SKILL.FIRE_BLAST:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.FIRE_BLAST}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.FIRE_BLAST);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.WHEEL_OF_FIRE:
            coordinatesTarget = transformAttackCoordinate(this.targetX, this.targetY);
            coordinates = transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.WHEEL_OF_FIRE}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
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

          case SPECIAL_SKILL.ORIGIN_PULSE:
            coordinatesTarget = transformAttackCoordinate(0, this.targetY);
            coordinates = transformAttackCoordinate(8, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.ORIGIN_PULSE}/0`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.ORIGIN_PULSE);
            this.scene.tweens.add({
              targets: specialProjectile,
              x: coordinatesTarget[0],
              y: coordinatesTarget[1],
              duration: 2000,
              onComplete: (tween, targets) => {
                specialProjectile.destroy();
              }
            });
            break;

          case SPECIAL_SKILL.SEED_FLARE:
            coordinates = transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.SEED_FLARE}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(5, 5);
            specialProjectile.anims.play(SPECIAL_SKILL.SEED_FLARE);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.SEISMIC_TOSS:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.SEISMIC_TOSS}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.SEISMIC_TOSS);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.GUILLOTINE:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.GUILLOTINE}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(3, 3);
            specialProjectile.anims.play(SPECIAL_SKILL.GUILLOTINE);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.ROCK_SLIDE:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.ROCK_SLIDE}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.ROCK_SLIDE);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.HEAT_WAVE:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.HEAT_WAVE}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.HEAT_WAVE);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.THUNDER:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.THUNDER}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.THUNDER);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.HYDRO_PUMP:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.HYDRO_PUMP}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.HYDRO_PUMP);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.DRACO_METEOR:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.DRACO_METEOR}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.DRACO_METEOR);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.BLAZE_KICK:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.BLAZE_KICK}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.BLAZE_KICK);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.WISH:
            coordinates = transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.WISH}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(3, 3);
            specialProjectile.anims.play(SPECIAL_SKILL.WISH);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.CALM_MIND:
            coordinates = transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.CALM_MIND}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.CALM_MIND);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.IRON_DEFENSE:
            coordinates = transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.IRON_DEFENSE}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.IRON_DEFENSE);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.METRONOME:
            coordinates = transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.METRONOME}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.METRONOME);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.SOAK:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.SOAK}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.SOAK);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.IRON_TAIL:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.IRON_TAIL}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.IRON_TAIL);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.BLAST_BURN:
            coordinates = transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.BLAST_BURN}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(3, 3);
            specialProjectile.anims.play(SPECIAL_SKILL.BLAST_BURN);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.CHARGE:
            coordinates = transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.CHARGE}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.CHARGE);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.DISCHARGE:
            coordinates = transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.DISCHARGE}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(3, 3);
            specialProjectile.anims.play(SPECIAL_SKILL.DISCHARGE);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.BITE:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.BITE}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.BITE);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.DRAGON_TAIL:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.DRAGON_TAIL}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.DRAGON_TAIL);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.DRAGON_BREATH:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.DRAGON_BREATH}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.DRAGON_BREATH);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.ICICLE_CRASH:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.ICICLE_CRASH}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(3, 3);
            specialProjectile.anims.play(SPECIAL_SKILL.ICICLE_CRASH);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.ROOT:
            coordinates = transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.ROOT}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.ROOT);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.TORMENT:
            coordinates = transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.TORMENT}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.TORMENT);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.STOMP:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.STOMP}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(3, 3);
            specialProjectile.anims.play(SPECIAL_SKILL.STOMP);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.DARK_PULSE:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.DARK_PULSE}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.DARK_PULSE);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.NIGHT_SLASH:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.NIGHT_SLASH}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.NIGHT_SLASH);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.BUG_BUZZ:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.BUG_BUZZ}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.BUG_BUZZ);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.POISON_STING:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.POISON_STING}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.POISON_STING);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.LEECH_LIFE:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.LEECH_LIFE}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.LEECH_LIFE);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.HAPPY_HOUR:
            coordinates = transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.HAPPY_HOUR}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.HAPPY_HOUR);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.TELEPORT:
            coordinates = transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.TELEPORT}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.TELEPORT);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.NASTY_PLOT:
            coordinates = transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.NASTY_PLOT}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.NASTY_PLOT);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.THIEF:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.THIEF}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.THIEF);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.STUN_SPORE:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.STUN_SPORE}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.STUN_SPORE);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.METEOR_MASH:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.METEOR_MASH}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(3, 3);
            specialProjectile.anims.play(SPECIAL_SKILL.METEOR_MASH);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.HURRICANE:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'specials', `${SPECIAL_SKILL.HURRICANE}/000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.HURRICANE);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.ROAR_OF_TIME:
            coordinates = transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'ROAR_OF_TIME', `000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.ROAR_OF_TIME);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.ROCK_TOMB:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'ROCK_TOMB', `000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.ROCK_TOMB);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.ROCK_SMASH:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'ROCK_SMASH', `000`);
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.ROCK_SMASH);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.VOLT_SWITCH:
            coordinates = transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], SPECIAL_SKILL.VOLT_SWITCH, '0');
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.VOLT_SWITCH);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.HYPER_VOICE:
            coordinatesTarget = transformAttackCoordinate(8, this.targetY);
            coordinates = transformAttackCoordinate(0, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], SPECIAL_SKILL.HYPER_VOICE, '0');
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.HYPER_VOICE);
            this.scene.tweens.add({
              targets: specialProjectile,
              x: coordinatesTarget[0],
              y: coordinatesTarget[1],
              duration: 1000,
              onComplete: (tween, targets) => {
                specialProjectile.destroy();
              }
            });
            break;

          case SPECIAL_SKILL.SHADOW_CLONE:
            coordinates = transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], SPECIAL_SKILL.SHADOW_CLONE, '0');
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.SHADOW_CLONE);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.ECHO:
            coordinates = transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], SPECIAL_SKILL.ECHO, '000');
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.ECHO);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.EXPLOSION:
            coordinates = transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], SPECIAL_SKILL.EXPLOSION, '000');
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.EXPLOSION);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;


          case SPECIAL_SKILL.CLANGOROUS_SOUL:
            coordinates = transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], SPECIAL_SKILL.CLANGOROUS_SOUL, '000');
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.CLANGOROUS_SOUL);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.GROWL:
            coordinates = transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], SPECIAL_SKILL.GROWL, '000');
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.GROWL);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.DISARMING_VOICE:
            group.getChildren().forEach((pokemon) => {
              if (this.team == pokemon.team) {
                const coordinates = transformAttackCoordinate(pokemon.positionX, pokemon.positionY);
                const s = this.scene.add.sprite(coordinates[0], coordinates[1], SPECIAL_SKILL.DISARMING_VOICE, '000');
                s.setDepth(7);
                s.setScale(2, 2);
                s.anims.play(SPECIAL_SKILL.DISARMING_VOICE);
                s.once('animationcomplete', () => {
                  s.destroy();
                });
              }
            });
            break;

          case SPECIAL_SKILL.RELIC_SONG:
            group.getChildren().forEach((pokemon) => {
              if (this.team != pokemon.team) {
                const coordinates = transformAttackCoordinate(pokemon.positionX, pokemon.positionY);
                const s = this.scene.add.sprite(coordinates[0], coordinates[1], SPECIAL_SKILL.RELIC_SONG, '000');
                s.setDepth(7);
                s.setScale(2, 2);
                s.anims.play(SPECIAL_SKILL.RELIC_SONG);
                s.once('animationcomplete', () => {
                  s.destroy();
                });
              }
            });
            break;

          case SPECIAL_SKILL.HIGH_JUMP_KICK:
            coordinates = transformAttackCoordinate(this.targetX, this.targetY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], SPECIAL_SKILL.HIGH_JUMP_KICK, '000');
            specialProjectile.setDepth(7);
            specialProjectile.setScale(2, 2);
            specialProjectile.anims.play(SPECIAL_SKILL.HIGH_JUMP_KICK);
            specialProjectile.once('animationcomplete', () => {
              specialProjectile.destroy();
            });
            break;

          case SPECIAL_SKILL.TRI_ATTACK:
            coordinatesTarget = transformAttackCoordinate(this.targetX, this.targetY);
            coordinates = transformAttackCoordinate(this.positionX, this.positionY);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], SPECIAL_SKILL.TRI_ATTACK, '000');
            specialProjectile.setDepth(7);
            specialProjectile.anims.play(SPECIAL_SKILL.TRI_ATTACK);
            this.scene.tweens.add({
              targets: specialProjectile,
              x: coordinatesTarget[0],
              y: coordinatesTarget[1],
              duration: 500,
              onComplete: (tween, targets) => {
                specialProjectile.destroy();
              }
            });
            break;

          case SPECIAL_SKILL.BONEMERANG:
            coordinatesTarget = transformAttackCoordinate(this.targetX, 6);
            coordinates = transformAttackCoordinate(this.targetX, 0);
            specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], SPECIAL_SKILL.BONEMERANG, '000');
            specialProjectile.setDepth(7);
            specialProjectile.setScale(3, 3);
            specialProjectile.anims.play(SPECIAL_SKILL.BONEMERANG);
            this.scene.tweens.add({
              targets: specialProjectile,
              x: coordinatesTarget[0],
              y: coordinatesTarget[1],
              ease: 'Power2',
              yoyo: true,
              duration: 1000,
              onComplete: (tween, targets) => {
                specialProjectile.destroy();
              }
            });
            break;

          default:
            break;
        }
      }
    }
  }

  addTween() {
    const coordinates = transformAttackCoordinate(this.targetX, this.targetY);

    if (this.scene) {
      // console.log(`Shooting a projectile to (${this.targetX},${this.targetY})`);
      this.scene.tweens.add({
        targets: this.projectile,
        x: coordinates[0],
        y: coordinates[1],
        ease: 'Linear',
        duration: this.atkSpeed ? 1000 / this.atkSpeed: 1500,
        onComplete: (tween, targets) => {
          this.projectile.destroy();
        }
      });
    } else {
      this.projectile.destroy();
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
      const lifeRatio = pokemon.life / (pokemon.life + pokemon.shield);
      const lifebar = new Lifebar(scene, -15, height, lifeRatio * 60, pokemon.hp, color, 'lifebar', true);
      lifebar.setLife(pokemon.life);
      this.add(lifebar);
    }
  }

  setShieldBar(pokemon, scene) {
    const h = this.height/2 + 5;
    if (pokemon.shield !== undefined && pokemon.shield > 0) {
      const shieldRatio = pokemon.shield / (pokemon.life + pokemon.shield);
      const shieldbar = new Lifebar(scene, -15 + (1-shieldRatio) * 30, h, shieldRatio * 60, pokemon.shield, 0x939393, 'shieldbar', true);
      shieldbar.setLife(pokemon.shield);
      this.add(shieldbar);
    }
  }

  setManaBar(pokemon, scene, height) {
    if (pokemon.mana !== undefined) {
      const color = 0x01b8fe;
      const manabar = new Lifebar(scene, -15, height + 5, 60, pokemon.maxMana, color, 'manabar', true);
      manabar.setLife(pokemon.mana);
      this.add(manabar);
    }
  }

  setEffects(pokemon, scene, height) {
    if (pokemon.effects.length > 0) {
      pokemon.effects.forEach((effect, c) => {
        if ( effect && EFFECTS_ICON[effect]) {
          const backgroundIcon = new GameObjects.Image(scene, c*20 -20, height +10, 'types', EFFECTS_ICON[effect].type).setScale(0.5, 0.5);
          backgroundIcon.objType = 'effect';
          scene.add.existing(backgroundIcon);
          this.add(backgroundIcon);
        }
      });
    }
  }

  setSprite(pokemon, scene) {
    const sprite = new GameObjects.Sprite(scene, 0, 0, pokemon.sheet, `${pokemon.index}/0/1/0`);
    this.height = sprite.height;
    this.width = sprite.width;

    if (pokemon.effects && (pokemon.effects.includes(EFFECTS.IRON_DEFENSE) || pokemon.effects.includes(EFFECTS.AUTOTOMIZE))) {
      sprite.setScale(3, 3);
    } else {
      sprite.setScale(2, 2);
    }
    const socle = new GameObjects.Image(scene, 0, this.height, 'socle');
    socle.objType = 'socle';
    sprite.objType = 'sprite';
    scene.add.existing(socle);
    scene.add.existing(sprite);
    this.add(socle);
    this.add(sprite);

    this.setShieldBar(pokemon, scene);
    this.setLifeBar(pokemon, scene, this.height/2 + 5);
    this.setManaBar(pokemon, scene, this.height/2 + 5);

    this.setItems(pokemon, scene);
    if (pokemon.effects) {
      this.setEffects(pokemon, scene, this.height + 30);
    }
  }

  setItem0(item) {
    if (this.item0) {
      this.remove(this.item0, true);
    }
    this.item0 = new ItemContainer(this.scene, this.width + 15, this.height - 50, item, false, 'item0');
    this.scene.add.existing(item);
    this.add(this.item0);
  }

  setItem1(item) {
    if (this.item1) {
      this.remove(this.item1, true);
    }
    this.item1 = new ItemContainer(this.scene, this.width + 15, this.height - 20, item, false, 'item1');
    this.scene.add.existing(this.item1);
    this.add(this.item1);
  }

  setItem2(item) {
    if (this.item2) {
      this.remove(this.item2, true);
    }
    this.item2 = new ItemContainer(this.scene, this.width + 15, this.height + 10, item, false, 'item2');
    this.scene.add.existing(this.item2);
    this.add(this.item2);
  }

  setItems(pokemon) {
    if (pokemon.items.item0 && pokemon.items.item0 != '') {
      this.setItem0(pokemon.items.item0);
    }
    if (pokemon.items.item1 && pokemon.items.item1 != '') {
      this.setItem1(pokemon.items.item1);
    }
    if (pokemon.items.item2 && pokemon.items.item2 != '') {
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

  addWound() {
    if (!this.getFirst('objType', 'wound')) {
      const wound = new GameObjects.Sprite(this.scene, 0, -30, 'wound', '000');
      wound.setScale(2, 2);
      this.scene.add.existing(wound);
      wound.objType = 'wound';
      wound.anims.play('wound');
      this.add(wound);
    }
  }

  removeWound() {
    const sprite = this.getFirst('objType', 'wound');
    if (sprite) {
      this.remove(sprite, true);
    }
  }

  addBurn() {
    if (!this.getFirst('objType', 'burn')) {
      const burn = new GameObjects.Sprite(this.scene, 0, -30, 'status', 'status/burn/000');
      burn.setScale(2, 2);
      this.scene.add.existing(burn);
      burn.objType = 'burn';
      burn.anims.play('burn');
      this.add(burn);
    }
  }

  removeBurn() {
    const sprite = this.getFirst('objType', 'burn');
    if (sprite) {
      this.remove(sprite, true);
    }
  }

  addSleep() {
    if (!this.getFirst('objType', 'sleep')) {
      const sleep = new GameObjects.Sprite(this.scene, 0, -30, 'status', 'status/sleep/000');
      sleep.setScale(2, 2);
      this.scene.add.existing(sleep);
      sleep.objType = 'sleep';
      sleep.anims.play('sleep');
      this.add(sleep);
    }
    // console.log('sleep');
    const sprite = this.getFirst('objType', 'sprite');
    sprite.anims.play(`${this.index}/2`);
  }

  removeSleep() {
    const sleepEffect = this.getFirst('objType', 'sleep');
    if (sleepEffect) {
      this.remove(sleepEffect, true);
    }
    // window.animationManager.animatePokemon(this);
  }

  addSilence() {
    if (!this.getFirst('objType', 'silence')) {
      const silence = new GameObjects.Sprite(this.scene, 0, -30, 'status', 'status/silence/000');
      silence.setScale(2, 2);
      this.scene.add.existing(silence);
      silence.objType = 'silence';
      silence.anims.play('silence');
      this.add(silence);
    }
  }

  removeSilence() {
    const sprite = this.getFirst('objType', 'silence');
    if (sprite) {
      this.remove(sprite, true);
    }
  }

  addFreeze() {
    if (!this.getFirst('objType', 'freeze')) {
      const freeze = new GameObjects.Sprite(this.scene, 0, 0, 'status', 'status/freeze/000');
      freeze.setScale(2, 2);
      this.scene.add.existing(freeze);
      freeze.objType = 'freeze';
      freeze.anims.play('freeze');
      this.add(freeze);
    }
  }

  removeFreeze() {
    const sprite = this.getFirst('objType', 'freeze');
    if (sprite) {
      this.remove(sprite, true);
    }
  }

  addConfusion() {
    if (!this.getFirst('objType', 'confusion')) {
      const confusion = new GameObjects.Sprite(this.scene, 0, -30, 'status', 'status/confusion/000');
      confusion.setScale(2, 2);
      this.scene.add.existing(confusion);
      confusion.objType = 'confusion';
      confusion.anims.play('confusion');
      this.add(confusion);
    }
  }

  removeConfusion() {
    const sprite = this.getFirst('objType', 'confusion');
    if (sprite) {
      this.remove(sprite, true);
    }
  }

  addPoison() {
    if (!this.getFirst('objType', 'poison')) {
      const poison = new GameObjects.Sprite(this.scene, 0, -30, 'status', 'status/poison/000');
      poison.setScale(2, 2);
      this.scene.add.existing(poison);
      poison.objType = 'poison';
      poison.anims.play('poison');
      this.add(poison);
    }
  }

  removePoison() {
    const sprite = this.getFirst('objType', 'poison');
    if (sprite) {
      this.remove(sprite, true);
    }
  }

  addProtect() {
    if (!this.getFirst('objType', 'protect')) {
      const protect = new GameObjects.Sprite(this.scene, 0, -30, 'status', 'status/protect/000');
      protect.setScale(2, 2);
      this.scene.add.existing(protect);
      protect.objType = 'protect';
      protect.anims.play('protect');
      this.add(protect);
    }
  }

  removeProtect() {
    const sprite = this.getFirst('objType', 'protect');
    if (sprite) {
      this.remove(sprite, true);
    }
  }

  addResurection() {
    if (!this.getFirst('objType', 'resurection')) {
      const resurection = new GameObjects.Sprite(this.scene, 0, -45, 'resurection', '000');
      resurection.setScale(2, 2);
      this.scene.add.existing(resurection);
      resurection.objType = 'resurection';
      resurection.anims.play('resurection');
      this.add(resurection);
    }
  }

  removeResurection() {
    const sprite = this.getFirst('objType', 'resurection');
    if (sprite) {
      this.remove(sprite, true);
    }
  }
}
