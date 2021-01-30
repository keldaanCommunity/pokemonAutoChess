const schema = require('@colyseus/schema');
const STATE_TYPE = require('../models/enum').STATE_TYPE;
const ORIENTATION = require('../models/enum').ORIENTATION;
const MovingState = require('./moving-state');
const AttackingState = require('./attacking-state');
const uniqid = require('uniqid');
const Items = require('../models/items');
const ArraySchema = schema.ArraySchema;
const PokemonFactory = require('../models/pokemon-factory');

class PokemonEntity extends schema.Schema {
  constructor(name, index, positionX, positionY, hp, maxMana, atk, atkSpeed, def, speDef, attackType, range, team, attackSprite, rarity, sheet, types, items, stars, simulation, skill) {
    super();

    this.state = new MovingState();
    this.effects = new ArraySchema();
    this.items = new Items(items);
    this.simulation = simulation;
    this.strategy = PokemonFactory.createStrategyFromName(skill);
    this.assign(
        {
          id: uniqid(),
          rarity: rarity,
          sheet: sheet,
          positionX: positionX,
          positionY: positionY,
          targetX: -1,
          targetY: -1,
          index: index,
          name: name,
          action: STATE_TYPE.MOVING,
          orientation: ORIENTATION.DOWNLEFT,
          baseAtk: atk,
          baseDef: def,
          atk: atk,
          def: def,
          baseSpeDef: speDef,
          speDef: speDef,
          attackType: attackType,
          hp: hp,
          maxMana: maxMana,
          mana: 0,
          life: hp,
          atkSpeed: atkSpeed,
          range: range,
          cooldown: 1000,
          manaCooldown: 1000,
          team: team,
          attackSprite: attackSprite,
          types: [],
          damageDone: 0,
          stars: stars,
          skill: skill,
          burn: false,
          silence: false,
          poison: false,
          freeze: false,
          protect: false,
          sleep: false,
          confusion: false
        }
    );

    this.burnCooldown = 0;
    this.silenceCooldown = 0;
    this.poisonCooldown = 0;
    this.freezeCooldown = 0;
    this.protectCooldown = 0;
    this.sleepCooldown = 0;
    this.confusionCooldown = 0;

    types.forEach((type) => {
      this.types.push(type);
    });
  }

  update(dt, board, climate) {
    this.state.update(this, dt, board, climate);
  }

  handleDamage(damage, board, attackType, attacker) {
    return this.state.handleDamage(this, damage, board, attackType, attacker);
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

  triggerBurn(timer) {
    this.burn = true;
    this.burnCooldown = timer;
  }

  updateBurn(dt) {
    if (this.burnCooldown - dt <= 0) {
      this.burn = false;
    } else {
      this.burnCooldown = this.burnCooldown - dt;
    }
  }

  triggerSilence(timer) {
    this.silence = true;
    this.silenceCooldown = timer;
  }

  updateSilence(dt) {
    if (this.silenceCooldown - dt <= 0) {
      this.silence = false;
    } else {
      this.silenceCooldown = this.silenceCooldown - dt;
    }
  }

  triggerPoison(timer) {
    this.poison = true;
    this.poisonCooldown = timer;
  }

  updatePoison(dt) {
    if (this.poisonCooldown - dt <= 0) {
      this.poison = false;
    } else {
      this.poisonCooldown = this.poisonCooldown - dt;
    }
  }

  triggerFreeze(timer) {
    this.freeze = true;
    this.freezeCooldown = timer;
  }

  updateFreeze(dt) {
    if (this.freezeCooldown - dt <= 0) {
      this.freeze = false;
    } else {
      this.freezeCooldown = this.freezeCooldown - dt;
    }
  }

  triggerProtect(timer) {
    this.protect = true;
    this.protectCooldown = timer;
  }

  updateProtect(dt) {
    if (this.protectCooldown - dt <= 0) {
      this.protect = false;
    } else {
      this.protectCooldown = this.protectCooldown - dt;
    }
  }

  triggerSleep(timer) {
    this.sleep = true;
    this.sleepCooldown = timer;
  }

  updateSleep(dt) {
    if (this.sleepCooldown - dt <= 0) {
      this.sleep = false;
    } else {
      this.sleepCooldown = this.sleepCooldown - dt;
    }
  }

  triggerConfusion(timer) {
    this.confusion = true;
    this.confusionCooldown = timer;
  }

  updateConfusion(dt) {
    if (this.confusionCooldown - dt <= 0) {
      this.confusion = false;
    } else {
      this.confusionCooldown = this.confusionCooldown - dt;
    }
  }

  setMana(mana) {
    if (!this.silence) {
      this.mana = Math.min(mana, this.maxMana);
    }
  }
}

schema.defineTypes(PokemonEntity, {
  positionX: 'uint8',
  positionY: 'uint8',
  action: 'string',
  index: 'uint16',
  id: 'string',
  orientation: 'string',
  hp: 'uint16',
  mana: 'uint8',
  maxMana: 'uint8',
  atk: 'uint16',
  def: 'uint16',
  speDef: 'uint16',
  attackType: 'string',
  life: 'uint16',
  team: 'uint8',
  range: 'uint8',
  atkSpeed: 'uint16',
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
  burn: 'boolean',
  silence: 'boolean',
  poison: 'boolean',
  freeze: 'boolean',
  protect: 'boolean',
  sleep: 'boolean',
  confusion: 'boolean'
});

module.exports = PokemonEntity;
