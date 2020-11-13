const schema = require('@colyseus/schema');
const STATE_TYPE = require('../models/enum').STATE_TYPE;
const ORIENTATION = require('../models/enum').ORIENTATION;
const MovingState = require('./moving-state');
const AttackingState = require('./attacking-state');
const uniqid = require('uniqid');
const Items = require('../models/items');
const ArraySchema = schema.ArraySchema;

class PokemonEntity extends schema.Schema {
  constructor(name, index, positionX, positionY, hp, maxMana, atk, def, speDef, attackType, range, team, attackSprite, rarity, sheet, types, items, stars, simulation) {
    super();

    this.state = new MovingState();
    this.effects = new ArraySchema();
    this.items = new Items(items);
    this.simulation = simulation;
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
        maxMana:maxMana,
        mana:0,
        life: hp,
        atkSpeed: 1000,
        range: range,
        cooldown: 1000,
        team: team,
        attackSprite: attackSprite,
        types: [],
        damageDone: 0,
        stars: stars
      }
    )

    types.forEach((type) => {
      this.types.push(type);
    });
  }

  update(dt, board, climate) {
    this.state.update(this, dt, board, climate);
  }

  handleDamage(damage, board, attackType) {
    return this.state.handleDamage(this, damage, board, attackType);
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
}

schema.defineTypes(PokemonEntity, {
  positionX: 'uint8',
  positionY: 'uint8',
  action: 'string',
  index: 'uint16',
  id: 'string',
  orientation: 'string',
  hp: 'uint8',
  mana: 'uint8',
  maxMana: 'uint8',
  atk: 'uint8',
  def: 'uint8',
  speDef: 'uint8',
  attackType: 'string',
  life: 'uint8',
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
  items:Items,
  stars:'uint8'
});

module.exports = PokemonEntity;
