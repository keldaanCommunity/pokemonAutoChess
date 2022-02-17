const schema = require('@colyseus/schema');
const {STATE_TYPE, ORIENTATION, ITEM} = require('../models/enum');
const MovingState = require('./moving-state');
const AttackingState = require('./attacking-state');
const uniqid = require('uniqid');
const Items = require('../models/colyseus-models/items');
const Status = require('../models/colyseus-models/status');
const Count = require('../models/colyseus-models/count');
const ArraySchema = schema.ArraySchema;
const PokemonFactory = require('../models/pokemon-factory');

class PokemonEntity extends schema.Schema {
  constructor(pokemon, positionX, positionY, team, simulation) {
    super();

    this.state = new MovingState();
    this.effects = new ArraySchema();
    this.items = new Items(pokemon.items);
    this.status = new Status();
    this.count = new Count();
    this.simulation = simulation;
    this.strategy = PokemonFactory.createStrategyFromName(pokemon.skill);
    this.assign(
        {
          id: uniqid(),
          rarity: pokemon.rarity,
          sheet: pokemon.sheet,
          positionX: positionX,
          positionY: positionY,
          targetX: -1,
          targetY: -1,
          index: pokemon.index,
          name: pokemon.name,
          critChance: 10,
          action: STATE_TYPE.MOVING,
          orientation: ORIENTATION.DOWNLEFT,
          baseAtk: pokemon.atk,
          baseDef: pokemon.def,
          atk: pokemon.atk,
          def: pokemon.def,
          baseSpeDef: pokemon.speDef,
          speDef: pokemon.speDef,
          attackType: pokemon.attackType,
          hp: pokemon.hp,
          maxMana: pokemon.maxMana,
          mana: 0,
          shield: 0,
          life: pokemon.hp,
          atkSpeed: pokemon.atkSpeed,
          atkSpeedBonus: 0,
          range: pokemon.range,
          cooldown: 500,
          manaCooldown: 1000,
          team: team,
          attackSprite: pokemon.attackSprite,
          types: [],
          damageDone: 0,
          stars: pokemon.stars,
          skill: pokemon.skill,
          critDamage: 2,
          spellDamage: 0
        }
    );
    this.dodge = 0;

    pokemon.types.forEach((type) => {
      this.types.push(type);
    });
  }

  update(dt, board, climate) {
    const updateEffects = this.state.update(this, dt, board, climate);
    if (updateEffects) {
      this.simulation.applyItemsEffects(this);
    }
  }

  getAttackDelay() {
    return 1000 / this.atkSpeed;
  }

  handleAttackSpeed(buff) {
    this.atkSpeedBonus = this.atkSpeedBonus + buff;
    this.atkSpeed = Number(Math.min(2.5, Math.max(0.2, 0.75 * (1 + this.atkSpeedBonus / 100))).toFixed(2));
  }

  handleDamage(damage, board, attackType, attacker) {
    return this.state.handleDamage(this, damage, board, attackType, attacker);
  }

  handleSpellDamage(damage, board, attackType, attacker) {
    let spellDamage = damage + attacker.spellDamage;
    if (attacker && 0.2 * attacker.items.count(ITEM.REAPER_CLOTH) > Math.random()) {
      spellDamage *= 2;
      this.count.crit ++;
    }
    if (attacker && attacker.items.count(ITEM.POKEMONOMICON) != 0) {
      this.status.triggerBurn(3000, this);
      this.status.triggerWound(3000);
    }
    if (attacker && attacker.items.count(ITEM.SHELL_BELL) != 0) {
      attacker.handleHeal(0.4 * damage * attacker.items.count(ITEM.SHELL_BELL));
    }
    if (this.status.runeProtect) {
      this.status.disableRuneProtect();
      return;
    } else {
      return this.state.handleDamage(this, spellDamage, board, attackType, attacker);
    }
  }

  handleHeal(heal) {
    return this.state.handleHeal(this, heal);
  }

  changeState(state) {
    this.state.onExit(this);
    this.state = state;
    this.state.onEnter(this);
  }

  toMovingState() {
    this.changeState(new MovingState(this.simulation));
  }

  toAttackingState() {
    this.changeState(new AttackingState(this.simulation));
  }

  setMana(mana) {
    if (!this.status.silence && !this.status.protect) {
      this.mana = Math.min(mana, this.maxMana);
    }
  }

  addCritChance(value) {
    // for every 5% crit chance > 100, +0.1 crit damage
    this.critChance += value;

    if (this.critChance > 100) {
      this.critDamage += Math.round((this.critChance - 100) * 10) / 500;
      this.critChance = 100;
    }
  }

  addDodgeChance(value) {
    this.dodge = Math.min(0.9, this.dodge + value);
  }
}

schema.defineTypes(PokemonEntity, {
  positionX: 'uint8',
  positionY: 'uint8',
  action: 'string',
  index: 'uint16',
  id: 'string',
  orientation: 'string',
  critChance: 'uint8',
  hp: 'uint16',
  mana: 'uint8',
  maxMana: 'uint8',
  atk: 'uint16',
  def: 'uint16',
  speDef: 'uint16',
  attackType: 'string',
  life: 'uint16',
  shield: 'uint16',
  team: 'uint8',
  range: 'uint8',
  atkSpeed: 'float32',
  atkSpeedBonus: 'int8',
  targetX: 'int8',
  targetY: 'int8',
  attackSprite: 'string',
  sheet: 'string',
  rarity: 'string',
  name: 'string',
  effects: ['string'],
  items: Items,
  stars: 'uint8',
  skill: 'string',
  status: Status,
  count: Count,
  critDamage: 'float32',
  spellDamage: 'uint8'
});

module.exports = PokemonEntity;
