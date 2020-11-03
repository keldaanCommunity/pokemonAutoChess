const Player = require('../../models/player');
const Shop = require('../../models/shop');
const schema = require('@colyseus/schema');
const SpecialCell = require('../../models/special-cell');
const BotManager = require('../../core/bot-manager');
const STATE = require('../../models/enum').STATE;
const MAP_TYPE = require('../../models/enum').MAP_TYPE;

class GameState extends schema.Schema {
  constructor() {
    super();
    const keys = Object.keys(MAP_TYPE);
    const mapType = keys[Math.floor(Math.random() * keys.length)];
    const time = 60000;
    const roundTime = Math.round(time/1000);
    this.players = new schema.MapSchema();
    this.botManager = new BotManager();
    this.shop = new Shop();
    this.specialCells = new schema.ArraySchema();
    this.elligibleToXP = true;
    this.initializeSpecialCells();

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

  initializeSpecialCells(){
    let x = [0,1,2,3,4,5,6,7];
    let y = [0,1,2];
    this.shuffle(x);
    this.shuffle(y);
    this.specialCells.push(new SpecialCell(x.pop(), y.pop()));
    this.specialCells.push(new SpecialCell(x.pop(), y.pop()));
  }

  shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }
}

schema.defineTypes(GameState, {
  roundTime: 'uint8',
  phase: 'string',
  players: {map: Player},
  stageLevel: 'uint8',
  mapType: 'string',
  specialCells: [SpecialCell]
});

module.exports = GameState;
