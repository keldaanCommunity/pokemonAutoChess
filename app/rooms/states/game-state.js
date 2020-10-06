const Player = require('../../models/player');
const Shop = require('../../models/shop');
const schema = require('@colyseus/schema');
const BotManager = require('../../core/bot-manager');
const STATE = require('../../models/enum').STATE;
const MAP_TYPE = require('../../models/enum').MAP_TYPE;

class GameState extends schema.Schema {
  constructor() {
    super();
    const keys = Object.keys(MAP_TYPE);
    const mapType = keys[Math.floor(Math.random() * keys.length)];
    const time = 30000;
    const roundTime = Math.round(time/1000);
    this.players = new schema.MapSchema();
    this.botManager = new BotManager();
    this.shop = new Shop();

    this.assign({
      time: time,
      neutralStages: [1, 2, 3, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
      stageLevel: 0,
      roundTime: roundTime,
      phase: STATE.PICK,
      gameFinished: false,
      mapType: mapType
    });
  }
}

schema.defineTypes(GameState, {
  roundTime: 'uint8',
  phase: 'string',
  players: {map: Player},
  stageLevel: 'uint8',
  mapType: 'string'
});

module.exports = GameState;
