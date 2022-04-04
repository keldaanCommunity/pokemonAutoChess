import {GameObjects} from 'phaser';
import Lifebar from './life-bar';
import Button from './button';
import PokemonDetail from './pokemon-detail';
import ItemsContainer from './items-container';
import {SPECIAL_SKILL, EFFECTS_ICON, EFFECTS, AUTHOR} from '../../../../models/enum';
import {transformAttackCoordinate, getAttackScale} from '../../pages/utils/utils';
import { IPokemon, IPokemonEntity, instanceofPokemonEntity } from '../../../../types';
import GameScene from '../scenes/game-scene';
import MoveToPlugin from 'phaser3-rex-plugins/plugins/moveto-plugin';
import MoveTo from 'phaser3-rex-plugins/plugins/moveto';
import PokemonEntity from '../../../../core/pokemon-entity';

export default class Pokemon extends Button {
  isPopup: boolean;
  objType: string;
  index: number;
  id: string;
  hp: number;
  range: number;
  critChance: number;
  atk: number;
  def: number;
  speDef: number;
  attackType: string;
  atkSpeed: number;
  targetX: number;
  targetY: number;
  skill: string;
  positionX: number;
  positionY: number;
  attackSprite: string;
  team: number;
  critDamage: number;
  spellDamage: number;
  life: number;
  shield: number;
  projectile: GameObjects.Sprite;
  itemsContainer: ItemsContainer;
  orientation: string;
  action: string;
  moveManager: MoveTo;
  rangeType: string;
  types: string[];
  lifebar: Lifebar;
  detail: PokemonDetail;
  shieldbar: Lifebar;
  mana: number;
  maxMana: number;
  manabar: Lifebar;
  backgroundIcon: GameObjects.Image;
  sprite: GameObjects.Sprite;
  socle: GameObjects.Image;
  wound: GameObjects.Sprite;
  burn: GameObjects.Sprite;
  sleep: GameObjects.Sprite;
  silence: GameObjects.Sprite;
  freeze: GameObjects.Sprite;
  confusion: GameObjects.Sprite;
  smoke: GameObjects.Sprite;
  armorReduction: GameObjects.Sprite;
  poison: GameObjects.Sprite;
  protect: GameObjects.Sprite;
  resurection: GameObjects.Sprite;
  runeProtect: GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number, pokemon: IPokemonEntity | IPokemon, dragable: boolean, isPopup: boolean) {
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
    this.types = pokemon.types;
    this.maxMana = pokemon.maxMana;
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
    if(instanceofPokemonEntity(pokemon)){
      const p = <IPokemonEntity> pokemon;
      this.mana = p.mana;
      this.team = p.team;
      this.shield = p.shield;
      this.life = p.life;
      this.critDamage = p.critDamage;
      this.spellDamage = p.spellDamage;
      this.critChance = p.critChance;
    }
    else{
      this.critDamage = 2;
      this.spellDamage = 0;
      this.critChance = 10;
    }
    this.setDepth(5);
  }

  enterButtonActiveState(pointer: Phaser.Input.Pointer){
    if(pointer.rightButtonDown()){
      if (this.detail) {
        this.detail.dom.remove();
        this.remove(this.detail, true);
        this.detail = undefined;
      }
      else{
        if (this.life) {
          this.detail = new PokemonDetail(this.scene, 0, 0, this.name, this.life, this.atk, this.def, this.speDef, this.attackType, this.range, this.atkSpeed.toFixed(2), this.critChance, this.critDamage, this.spellDamage, this.mana, this.types, this.skill, AUTHOR[this.name]);
        } else {
          this.detail = new PokemonDetail(this.scene, 0, 0, this.name, this.hp, this.atk, this.def, this.speDef, this.attackType, this.range, this.atkSpeed.toFixed(2), this.critChance, this.critDamage, this.spellDamage, this.maxMana, this.types, this.skill, AUTHOR[this.name]);
        }
        this.detail.setPosition(this.detail.width / 2 + 40, -this.detail.height / 2 - 40);
        this.add(this.detail);
      }
    }
  }

  attackAnimation() {
    let x: number;
    let y: number;
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

  incenseAnimation() {
    const coordinates = transformAttackCoordinate(this.positionX, this.positionY);
    const specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'INCENSE_DAMAGE', '000');
    specialProjectile.setDepth(7);
    specialProjectile.setScale(2, 2);
    specialProjectile.anims.play('INCENSE_DAMAGE');
    specialProjectile.once('animationcomplete', () => {
      specialProjectile.destroy();
    });
  }

  brightPowderAnimation() {
    const coordinates = transformAttackCoordinate(this.positionX, this.positionY);
    const specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'BRIGHT_POWDER', '000');
    specialProjectile.setDepth(7);
    specialProjectile.setScale(2, 2);
    specialProjectile.anims.play('BRIGHT_POWDER');
    specialProjectile.once('animationcomplete', () => {
      specialProjectile.destroy();
    });
  }

  staticAnimation() {
    const coordinates = transformAttackCoordinate(this.positionX, this.positionY);
    const specialProjectile = this.scene.add.sprite(coordinates[0], coordinates[1], 'STATIC', '000');
    specialProjectile.setDepth(7);
    specialProjectile.setScale(3, 3);
    specialProjectile.anims.play('STATIC');
    specialProjectile.once('animationcomplete', () => {
      specialProjectile.destroy();
    });
  }

  deathAnimation() {
    this.life = 0;
    this.lifebar.setLife(this.life);

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

  specialAttackAnimation(group: Phaser.GameObjects.Group) {
    if (this.skill) {
      let coordinates: number[];
      let specialProjectile: GameObjects.Sprite;
      let coordinatesTarget: number[];

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
              onComplete: () => {
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
              onComplete: () => {
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
              onComplete: () => {
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
            group.getChildren().forEach((p) => {
              const pokemon = <Pokemon> p;
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
            group.getChildren().forEach((p) => {
              const pokemon = <Pokemon> p;
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
              onComplete: () => {
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
              onComplete: () => {
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
        onComplete: () => {
          this.projectile.destroy();
        }
      });
    } else {
      this.projectile.destroy();
    }
  }

  setLifeBar(pokemon: IPokemonEntity, scene: Phaser.Scene, height: number) {
    if (pokemon.life !== undefined) {
      let color: number;
      if (pokemon.team == 0) {
        color = 0x00ff00;
      } else {
        color = 0xff0000;
      }
      const lifeRatio = pokemon.life / (pokemon.life + pokemon.shield);
      this.lifebar = new Lifebar(scene, -15, height, lifeRatio * 60, pokemon.hp, color, true);
      this.lifebar.setLife(pokemon.life);
      this.add(this.lifebar);
    }
  }

  setShieldBar(pokemon: IPokemonEntity, scene: Phaser.Scene) {
    const h = this.height/2 + 5;
    if (pokemon.shield !== undefined && pokemon.shield > 0) {
      const shieldRatio = pokemon.shield / (pokemon.life + pokemon.shield);
      this.shieldbar = new Lifebar(scene, -15 + (1-shieldRatio) * 30, h, shieldRatio * 60, pokemon.shield, 0x939393, true);
      this.shieldbar.setLife(pokemon.shield);
      this.add(this.shieldbar);
    }
  }

  setManaBar(pokemon: IPokemonEntity, scene: Phaser.Scene, height: number) {
    if (pokemon.mana !== undefined) {
      const color = 0x01b8fe;
      this.manabar = new Lifebar(scene, -15, height + 5, 60, pokemon.maxMana, color, true);
      this.manabar.setLife(pokemon.mana);
      this.add(this.manabar);
    }
  }

  setEffects(pokemon: IPokemonEntity, scene: Phaser.Scene, height: number) {
    if (pokemon.effects.length > 0) {
      pokemon.effects.forEach((effect, c) => {
        if ( effect && EFFECTS_ICON[effect]) {
          this.backgroundIcon = new GameObjects.Image(scene, c*20 -20, height +10, 'types', EFFECTS_ICON[effect].type).setScale(0.5, 0.5);
          this.add(this.backgroundIcon);
        }
      });
    }
  }

  setSprite(pokemon: IPokemonEntity | IPokemon, scene: Phaser.Scene) {
    const p = <IPokemonEntity> pokemon;
    this.sprite = new GameObjects.Sprite(scene, 0, 0, p.sheet, `${p.index}/0/1/0`);
    this.sprite.setScale(2, 2);
    this.height = this.sprite.height;
    this.width = this.sprite.width;
    this.itemsContainer = new ItemsContainer(scene, p.items, this.width + 20, -this.height/2 -20, false);
    this.socle = new GameObjects.Image(scene, 0, this.height, 'socle');
    scene.add.existing(this.socle);
    scene.add.existing(this.sprite);
    this.add(this.socle);
    this.add(this.sprite);
    this.add(this.itemsContainer);

    if(instanceofPokemonEntity(pokemon)){
      const p = <IPokemonEntity> pokemon;
      if (p.effects && (p.effects.includes(EFFECTS.IRON_DEFENSE) || p.effects.includes(EFFECTS.AUTOTOMIZE))) {
        this.sprite.setScale(3, 3);
      }
      this.setShieldBar(p, scene);
      this.setLifeBar(p, scene, this.height/2 + 5);
      this.setManaBar(p, scene, this.height/2 + 5);
      this.setEffects(p, scene, this.height + 30);
    }
  }

  setParameters(pokemon: IPokemonEntity | IPokemon) {
    const p = <IPokemonEntity> pokemon;
    if(p.orientation){
      this.orientation = p.orientation;
      this.action = p.action;
    }
    else{
      this.orientation = 'DOWNLEFT';
      this.action = 'MOVING';
    }
  }

  setMovingFunction(scene: Phaser.Scene) {
    const p = <MoveToPlugin> scene.plugins.get('rexMoveTo');
    this.moveManager = p.add(this, {
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
    if (!this.wound) {
      this.wound = new GameObjects.Sprite(this.scene, 0, -30, 'wound', '000');
      this.wound.setScale(2, 2);
      this.scene.add.existing(this.wound);
      this.wound.anims.play('wound');
      this.add(this.wound);
    }
  }

  removeWound() {
    if (this.wound) {
      this.remove(this.wound, true);
      this.wound = undefined;
    }
  }

  addBurn() {
    if (!this.burn) {
      this.burn = new GameObjects.Sprite(this.scene, 0, -30, 'status', 'status/burn/000');
      this.burn.setScale(2, 2);
      this.scene.add.existing(this.burn);
      this.burn.anims.play('burn');
      this.add(this.burn);
    }
  }

  removeBurn() {
    if (this.burn) {
      this.remove(this.burn, true);
      this.burn = undefined;
    }
  }

  addSleep() {
    if (!this.sleep) {
      this.sleep = new GameObjects.Sprite(this.scene, 0, -30, 'status', 'status/sleep/000');
      this.sleep.setScale(2, 2);
      this.scene.add.existing(this.sleep);
      this.sleep.anims.play('sleep');
      this.add(this.sleep);
    }
    this.sprite.anims.play(`${this.index}/2`);
  }

  removeSleep() {
    if (this.sleep) {
      this.remove(this.sleep, true);
      this.sleep = undefined;
    }
  }

  addSilence() {
    if (!this.silence) {
      this.silence = new GameObjects.Sprite(this.scene, 0, -30, 'status', 'status/silence/000');
      this.silence.setScale(2, 2);
      this.scene.add.existing(this.silence);
      this.silence.anims.play('silence');
      this.add(this.silence);
    }
  }

  removeSilence() {
    if (this.silence) {
      this.remove(this.silence, true);
      this.silence = undefined;
    }
  }

  addFreeze() {
    if (!this.freeze) {
      this.freeze = new GameObjects.Sprite(this.scene, 0, 0, 'status', 'status/freeze/000');
      this.freeze.setScale(2, 2);
      this.scene.add.existing(this.freeze);
      this.freeze.anims.play('freeze');
      this.add(this.freeze);
    }
  }

  removeFreeze() {
    if (this.freeze) {
      this.remove(this.freeze, true);
      this.freeze = undefined;
    }
  }

  addConfusion() {
    if (!this.confusion) {
      this.confusion = new GameObjects.Sprite(this.scene, 0, -30, 'status', 'status/confusion/000');
      this.confusion.setScale(2, 2);
      this.scene.add.existing(this.confusion);
      this.confusion.anims.play('confusion');
      this.add(this.confusion);
    }
  }

  removeConfusion() {
    if (this.confusion) {
      this.remove(this.confusion, true);
      this.confusion = undefined;
    }
  }

  addSmoke() {
    if (!this.smoke) {
      this.smoke = new GameObjects.Sprite(this.scene, 0, -40, 'smoke', '000');
      this.smoke.setScale(2, 2);
      this.scene.add.existing(this.smoke);
      this.smoke.anims.play('smoke');
      this.add(this.smoke);
    }
  }

  removeSmoke() {
    if (this.smoke) {
      this.remove(this.smoke, true);
      this.smoke = undefined;
    }
  }

  addArmorReduction() {
    if (this.armorReduction) {
      this.armorReduction = new GameObjects.Sprite(this.scene, 0, -40, 'armorReduction', '000');
      this.armorReduction.setScale(2, 2);
      this.scene.add.existing(this.armorReduction);
      this.armorReduction.anims.play('armorReduction');
      this.add(this.armorReduction);
    }
  }

  removeArmorReduction() {
    if (this.armorReduction) {
      this.remove(this.armorReduction, true);
      this.armorReduction = undefined;
    }
  }


  addPoison() {
    if (this.poison) {
      this.poison = new GameObjects.Sprite(this.scene, 0, -30, 'status', 'status/poison/000');
      this.poison.setScale(2, 2);
      this.scene.add.existing(this.poison);
      this.poison.anims.play('poison');
      this.add(this.poison);
    }
  }

  removePoison() {
    if (this.poison) {
      this.remove(this.poison, true);
      this.poison = undefined;
    }
  }

  addProtect() {
    if (!this.protect) {
      this.protect = new GameObjects.Sprite(this.scene, 0, -30, 'status', 'status/protect/000');
      this.protect.setScale(2, 2);
      this.scene.add.existing(this.protect);
      this.protect.anims.play('protect');
      this.add(this.protect);
    }
  }

  removeProtect() {
    if (this.protect) {
      this.remove(this.protect, true);
      this.protect = undefined;
    }
  }

  addResurection() {
    if (!this.resurection) {
      this.resurection = new GameObjects.Sprite(this.scene, 0, -45, 'resurection', '000');
      this.resurection.setScale(2, 2);
      this.scene.add.existing(this.resurection);
      this.resurection.anims.play('resurection');
      this.add(this.resurection);
    }
  }

  removeResurection() {
    if (this.resurection) {
      this.remove(this.resurection, true);
      this.resurection = undefined;
    }
  }

  addRuneProtect() {
    if (!this.runeProtect) {
      this.runeProtect = new GameObjects.Sprite(this.scene, 0, -45, 'rune_protect', '000');
      this.runeProtect.setScale(2, 2);
      this.scene.add.existing(this.runeProtect);
      this.runeProtect.anims.play('rune_protect');
      this.add(this.runeProtect);
    }
  }

  removeRuneProtect() {
    if (this.runeProtect) {
      this.remove(this.runeProtect, true);
      this.runeProtect = undefined;
    }
  }
}