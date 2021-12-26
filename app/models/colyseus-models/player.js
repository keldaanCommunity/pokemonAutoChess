const schema = require('@colyseus/schema');
const Pokemon = require('./pokemon').Pokemon;
const ExperienceManager = require('./experience-manager');
const Simulation = require('../../core/simulation');
const Synergies = require('./synergies');
const Effects = require('../effects');
const Stuff = require('./stuff');
const BattleResult = require('./battle-result');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

class Player extends Schema {
  constructor(id, name, elo, avatar, isBot, specialCells, mapType, rank, tileset) {
    super();
    this.opponents = [];
    this.assign({
      id: id,
      name: name,
      avatar: avatar,
      board: new MapSchema(),
      shop: new ArraySchema(),
      history: new ArraySchema(),
      stuff: new Stuff(),
      itemsProposition: new ArraySchema(),
      experienceManager: new ExperienceManager(),
      synergies: new Synergies(),
      effects: new Effects(),
      money: process.env.MODE == 'dev' ? 400 : 5,
      life: process.env.MODE == 'dev' ? 10 : 100,
      simulation: new Simulation(specialCells, mapType),
      shopLocked: false,
      streak: 0,
      interest: 0,
      boardSize: 0,
      alive: true,
      isBot: isBot,
      exp: 0,
      rank: rank,
      elo: elo,
      tileset: tileset,
      opponentame: '',
      opponentAvatar: ''
    });
  }

  addBattleResult(name, result, avatar) {
    if (this.history.length >= 5) {
      this.history.shift();
    }
    this.history.push(new BattleResult(name, result, avatar));
  }

  getLastBattleResult() {
    if (this.history.length > 0) {
      return this.history[this.history.length - 1].result;
    } else {
      return '';
    }
  }
}

schema.defineTypes(Player, {
  id: 'string',
  name: 'string',
  avatar: 'string',
  board: {map: Pokemon},
  shop: ['string'],
  simulation: Simulation,
  experienceManager: ExperienceManager,
  synergies: Synergies,
  itemsProposition: ['string'],
  money: 'uint8',
  life: 'uint8',
  shopLocked: 'boolean',
  streak: 'uint8',
  interest: 'uint8',
  opponentName: 'string',
  opponentAvatar: 'string',
  boardSize: 'uint8',
  stuff: Stuff,
  rank: 'uint8',
  exp: 'uint16',
  alive: 'boolean',
  elo: 'uint16',
  tileset: 'string',
  history: [BattleResult]
});

module.exports = Player;
