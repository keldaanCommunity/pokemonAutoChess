const schema = require('@colyseus/schema');
const STATE_TYPE = require('../models/enum').STATE_TYPE;
const ORIENTATION = require('../models/enum').ORIENTATION;
const MovingState = require('./moving-state');
const AttackingState = require('./attacking-state');
const uniqid = require('uniqid');

class PokemonEntity extends schema.Schema {
  constructor(name, index, positionX, positionY, hp, atk, range, team, attackSprite, rarity, types) {
    super();
    this.id = uniqid();
    this.rarity = rarity;
    this.positionX = positionX;
    this.positionY = positionY;
    this.buffed = false;
    this.debuffed = false;
    this.berserk = false;
    this.targetX = -1;
    this.targetY = -1;
    this.index = index;
    this.name = name;
    this.state = new MovingState();
    this.action = STATE_TYPE.MOVING;
    this.orientation = ORIENTATION.DOWNLEFT;
    this.atk = atk;
    this.hp = hp;
    this.life = hp;
    this.range = range;
    this.cooldown = 1000;
    this.team = team;
    this.attackSprite = attackSprite;
    this.types = [];
    types.forEach(type=>{
      this.types.push(type);
    });
  }

  update(dt, board, climate) {
    this.state.update(this, dt, board, climate);
  }

  handleDamage(damage, board) {
    this.state.handleDamage(this, damage, board);
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
  life: 'uint8',
  team: 'uint8',
  range: 'uint8',
  targetX: 'int8',
  targetY: 'int8',
  attackSprite: 'string',
  rarity: 'string',
  name: 'string',
  buffed: 'boolean',
  debuffed: 'boolean'
});

module.exports = PokemonEntity;
