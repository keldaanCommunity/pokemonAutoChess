const Player = require('../../models/colyseus-models/player');
const Shop = require('../../models/shop');
const Design = require('../../core/design');
const schema = require('@colyseus/schema');
// const SpecialCell = require('../../models/colyseus-models/special-cell');
const BotManager = require('../../core/bot-manager');
const {MAP, STATE} = require('../../models/enum');

class GameState extends schema.Schema {
  constructor() {
    super();

    const time = process.env.MODE == 'dev' ? 10000 : 30000;
    const roundTime = Math.round(time/1000);
    this.players = new schema.MapSchema();
    this.botManager = new BotManager();
    this.shop = new Shop();
    this.elligibleToXP = false;
    const keys = Object.keys(MAP);
    this.id = keys[Math.floor(Math.random() * keys.length)];
    this.design = new Design(this.id, 5, 0.1);
    this.tilemap = this.design.exportToTiled();

    this.assign({
      time: time,
      stageLevel: 0,
      roundTime: roundTime,
      phase: STATE.PICK,
      gameFinished: false,
      afterGameId: '',
      mapName: MAP[this.id].name
    });
  }

  shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }
}

schema.defineTypes(GameState, {
  afterGameId: 'string',
  roundTime: 'uint8',
  phase: 'string',
  players: {map: Player},
  stageLevel: 'uint8',
  mapName: 'string'
});

module.exports = GameState;
