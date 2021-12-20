const Player = require('../../models/colyseus-models/player');
const Shop = require('../../models/shop');
const schema = require('@colyseus/schema');
const SpecialCell = require('../../models/colyseus-models/special-cell');
const BotManager = require('../../core/bot-manager');
const STATE = require('../../models/enum').STATE;
const MAP_TYPE = require('../../models/enum').MAP_TYPE;

class GameState extends schema.Schema {
  constructor() {
    super();
    const keys = Object.keys(MAP_TYPE);
    const mapType = keys[Math.floor(Math.random() * keys.length)];
    //const mapType = MAP_TYPE.GROUND;
    const time = process.env.MODE == 'dev' ? 10000 : 30000;
    const roundTime = Math.round(time/1000);
    this.players = new schema.MapSchema();
    this.botManager = new BotManager();
    this.shop = new Shop();
    this.specialCells = new schema.ArraySchema();
    this.elligibleToXP = false;
    this.initializeSpecialCells();

    this.assign({
      time: time,
      stageLevel: 0,
      roundTime: roundTime,
      phase: STATE.PICK,
      gameFinished: false,
      mapType: mapType,
      afterGameId:''
    });
  }

  initializeSpecialCells() {
    const x = [0, 1, 2, 3, 4, 5, 6, 7];
    const y = [0, 1, 2];
    this.shuffle(x);
    this.shuffle(y);
    let firstPodX = x.pop();
    let firstPodY = y.pop();
    let secondPodX = x.pop();
    let secondPodY = y.pop();
    this.specialCells.push(new SpecialCell(firstPodX, firstPodY));
    this.specialCells.push(new SpecialCell(secondPodX, secondPodY));
    this.specialCells.push(new SpecialCell(firstPodX, 5 - firstPodY));
    this.specialCells.push(new SpecialCell(secondPodX, 5 - secondPodY));
  }

  shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }
}

schema.defineTypes(GameState, {
  afterGameId:'string',
  roundTime: 'uint8',
  phase: 'string',
  players: {map: Player},
  stageLevel: 'uint8',
  mapType: 'string',
  specialCells: [SpecialCell]
});

module.exports = GameState;
