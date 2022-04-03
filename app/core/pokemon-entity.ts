import {STATE_TYPE, ORIENTATION, ITEM} from '../models/enum';
import MovingState from './moving-state';
import AttackingState from './attacking-state';
import uniqid from 'uniqid';
import Status from '../models/colyseus-models/status';
import Count from '../models/colyseus-models/count';
import PokemonFactory from '../models/pokemon-factory';
import Simulation from './simulation';
import {Schema, type, ArraySchema, SetSchema} from '@colyseus/schema';
import {AttackStrategy} from './attack-strategy';
import Board from './board';
import PokemonState from './pokemon-state';
import { IPokemonEntity, IPokemon } from '../types';

export default class PokemonEntity extends Schema implements IPokemonEntity{

  @type('uint8') positionX: number;
  @type('uint8') positionY: number;
  @type('string') action = STATE_TYPE.MOVING;
  @type('uint16') index: number;
  @type('string') id: string;
  @type('string') orientation = ORIENTATION.DOWNLEFT;
  @type('uint8') critChance = 10;
  @type('uint16') hp: number;
  @type('uint8') mana = 0;
  @type('uint8') maxMana: number;
  @type('uint16') atk: number;
  @type('uint16') def: number;
  @type('uint16') speDef: number;
  @type('string') attackType: string;
  @type('uint16') life: number;
  @type('uint16') shield = 0;
  @type('uint8') team: number;
  @type('uint8') range: number;
  @type('float32') atkSpeed: number;
  @type('uint8') atkSpeedBonus = 0;
  @type('int8') targetX = -1;
  @type('int8') targetY = -1;
  @type('string') attackSprite: string;
  @type('string') sheet: string;
  @type('string') rarity: string;
  @type('string') name: string;
  @type(['string']) effects = new ArraySchema<string>();
  @type({set: 'string'}) items = new SetSchema<string>();
  @type(['string']) types = new ArraySchema<string>();
  @type('uint8') stars: number;
  @type('string')  skill: string;
  @type(Status) status: Status;
  @type(Count) count: Count;
  @type('float32') critDamage = 2;
  @type('uint8') spellDamage = 0;
  @type('uint16') healDone: number;
  cooldown = 500;
  manaCooldown = 1000;
  state: MovingState;
  simulation: Simulation;
  strategy: AttackStrategy;
  baseAtk: number;
  baseDef: number;
  baseSpeDef: number;
  dodge: number;
  physicalDamage: number;
  specialDamage: number;
  trueDamage: number;
  shieldDone: number;
  flyingProtection: boolean;
  growGroundTimer: number;
  echo: number;

  constructor(pokemon: IPokemon, positionX: number, positionY: number, team: number, simulation: Simulation) {
    super();

    this.state = new MovingState();
    this.effects = new ArraySchema();
    this.items = new SetSchema();
    pokemon.items.forEach((it) => {
      this.items.add(it);
    });
    this.status = new Status();
    this.count = new Count();
    this.simulation = simulation;
    this.strategy = PokemonFactory.createStrategyFromName(pokemon.skill);

    this.id= uniqid();
    this.rarity = pokemon.rarity;
    this.sheet = pokemon.sheet;
    this.positionX = positionX;
    this.positionY = positionY;
    this.index = pokemon.index;
    this.name = pokemon.name;
    this.action = STATE_TYPE.MOVING;
    this.orientation = ORIENTATION.DOWNLEFT;
    this.baseAtk = pokemon.atk;
    this.baseDef = pokemon.def;
    this.baseSpeDef = pokemon.speDef;
    this.atk = pokemon.atk;
    this.def = pokemon.def;
    this.speDef = pokemon.speDef;
    this.attackType = pokemon.attackType;
    this.hp = pokemon.hp;
    this.maxMana = pokemon.maxMana;
    this.life = pokemon.hp;
    this.atkSpeed = pokemon.atkSpeed;
    this.range = pokemon.range;
    this.team = team;
    this.attackSprite = pokemon.attackSprite;
    this.stars = pokemon.stars;
    this.skill = pokemon.skill;

    this.dodge = 0;
    this.physicalDamage = 0;
    this.specialDamage = 0;
    this.trueDamage = 0;
    this.healDone = 0;
    this.shieldDone = 0;

    pokemon.types.forEach((type) => {
      this.types.push(type);
    });
  }

  update(dt: number, board: Board, climate: string) {
    const updateEffects = this.state.update(this, dt, board, climate);
    if (updateEffects) {
      this.simulation.applyItemsEffects(this);
    }
  }

  getAttackDelay() {
    return 1000 / this.atkSpeed;
  }

  handleAttackSpeed(buff: number) {
    this.atkSpeedBonus = this.atkSpeedBonus + buff;
    this.atkSpeed = Number(Math.min(2.5, Math.max(0.2, 0.75 * (1 + this.atkSpeedBonus / 100))).toFixed(2));
  }

  handleDamage(damage: number, board: Board, attackType: string, attacker: PokemonEntity) {
    return this.state.handleDamage(this, damage, board, attackType, attacker);
  }

  handleSpellDamage(damage: number, board: Board, attackType: string, attacker: PokemonEntity) {
    let spellDamage = damage + damage * attacker.spellDamage / 100;
    if (attacker && attacker.items.has(ITEM.REAPER_CLOTH) &&  Math.random() > 0.8) {
      spellDamage *= 2;
      this.count.crit ++;
    }
    if (attacker && attacker.items.has(ITEM.POKEMONOMICON)) {
      this.status.triggerBurn(2000, this, attacker);
      this.status.triggerWound(2000);
    }
    if (attacker && attacker.items.has(ITEM.SHELL_BELL)) {
      attacker.handleHeal(0.4 * damage, attacker);
    }
    if (this.status.runeProtect) {
      this.status.disableRuneProtect();
      return;
    } else {
      return this.state.handleDamage(this, spellDamage, board, attackType, attacker);
    }
  }

  handleHeal(heal: number, caster: IPokemonEntity) {
    return this.state.handleHeal(this, heal, caster);
  }

  handleShield(shield: number, caster: IPokemonEntity) {
    return this.state.handleShield(this, shield, caster);
  }

  changeState(state: PokemonState) {
    this.state.onExit(this);
    this.state = state;
    this.state.onEnter(this);
  }

  toMovingState() {
    this.changeState(new MovingState());
  }

  toAttackingState() {
    this.changeState(new AttackingState());
  }

  setMana(mana: number) {
    if (!this.status.silence && !this.status.protect) {
      this.mana = Math.min(mana, this.maxMana);
    }
  }

  addCritChance(value: number) {
    // for every 5% crit chance > 100, +0.1 crit damage
    this.critChance += value;

    if (this.critChance > 100) {
      this.critDamage += Math.round((this.critChance - 100) * 10) / 500;
      this.critChance = 100;
    }
  }

  addDodgeChance(value: number) {
    this.dodge = Math.min(0.9, this.dodge + value);
  }

  addSpellDamage(value: number) {
    this.spellDamage = Math.min(100, this.spellDamage + value);
  }
}