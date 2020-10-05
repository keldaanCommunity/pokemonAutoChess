const Player = require('../../models/player');
const Shop = require('../../models/shop');
const schema = require('@colyseus/schema');
const BotManager = require('../../core/bot-manager');
const STATE = require('../../models/enum').STATE;

class GameState extends schema.Schema {
  constructor() {
    super();
    this.time = 30000;
    this.neutralStages = [1, 2, 3, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    this.stageLevel = 0;
    this.roundTime = Math.round(this.time/1000);
    this.phase = STATE.PICK;
    this.players = new schema.MapSchema();
    this.shop = new Shop();
    this.gameFinished = false;
    this.botManager = new BotManager();
  }
}

schema.defineTypes(GameState, {
  roundTime: 'uint8',
  phase: 'string',
  players: {map: Player},
  stageLevel: 'uint8'
});

module.exports = GameState;
