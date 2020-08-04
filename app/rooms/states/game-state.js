const Player = require('../../models/player');
const Shop = require('../../models/shop');
const schema = require('@colyseus/schema');
const STATE = require('../../models/enum').STATE;

class GameState extends schema.Schema {
  constructor() {
    super();
    this.time = 5000;
    this.neutralStages = [1, 2, 3, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    this.stageLevel = 0;
    this.roundTime = Math.round(this.time/1000);
    this.phase = STATE.PICK;
    this.players = new schema.MapSchema();
    this.shop = new Shop();
  }
}

schema.defineTypes(GameState, {
  roundTime: 'uint8',
  phase: 'string',
  players: {map: Player},
  stageLevel: 'uint8'
});

module.exports = GameState;
