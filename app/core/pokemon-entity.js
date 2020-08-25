const schema = require('@colyseus/schema');
const STATE_TYPE = require('../models/enum').STATE_TYPE;
const ORIENTATION = require('../models/enum').ORIENTATION;
const MovingState = require('./moving-state');
const AttackingState = require('./attacking-state');
const uniqid = require('uniqid');
const ArraySchema = schema.ArraySchema;

class PokemonEntity extends schema.Schema {
  constructor(name, index, positionX, positionY, hp, atk, def, speDef, attackType, range, team, attackSprite, rarity) {
    super();
    this.id = uniqid();
    this.rarity = rarity;
    this.positionX = positionX;
    this.positionY = positionY;
    this.targetX = -1;
    this.targetY = -1;
    this.index = index;
    this.name = name;
    this.state = new MovingState();
    this.action = STATE_TYPE.MOVING;
    this.orientation = ORIENTATION.DOWNLEFT;
    this.baseAtk = atk;
    this.baseDef = def;
    this.atk = atk;
    this.def = def;
    this.baseSpeDef = speDef;
    this.speDef = speDef;
    this.attackType = attackType;
    this.hp = hp;
    this.life = hp;
    this.atkSpeed = 1000;
    this.range = range;
    this.cooldown = 1000;
    this.team = team;
    this.attackSprite = attackSprite;
    this.types = [];
    this.effects = new ArraySchema();
  }

  update(dt, board, climate) {
    this.state.update(this, dt, board, climate);
  }

  handleDamage(damage, board, attackType) {
    this.state.handleDamage(this, damage, board, attackType);
  }

  changeState(state) {
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
}

schema.defineTypes(PokemonEntity, {
  positionX: 'uint8',
  positionY: 'uint8',
  action: 'string',
  index: 'uint16',
  id: 'string',
  orientation: 'string',
  hp: 'uint8',
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
  rarity: 'string',
  name: 'string',
  effects: ['string']
});

module.exports = PokemonEntity;
