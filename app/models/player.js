const schema = require('@colyseus/schema');
const Pokemon = require('./pokemon').Pokemon;
const ExperienceManager = require('./experience-manager');
const Simulation = require('../core/simulation');
const Synergies = require('./synergies');
const Effects = require('./effects');
const Stuff = require('./stuff');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

class Player extends Schema {
  constructor(id, name, avatar, isBot, specialCells, mapType, email) {
    super();
    this.assign({
      id: id,
      name: name,
      avatar: avatar,
      board: new MapSchema(),
      shop: new ArraySchema(),
      stuff: new Stuff(),
      experienceManager: new ExperienceManager(),
      synergies: new Synergies(),
      effects: new Effects(),
      money: 5,
      life: 100,
      simulation: new Simulation(specialCells, mapType),
      shopLocked: false,
      streak: 0,
      interest: 0,
      lastBattleResult: '',
      opponentName: '',
      boardSize: 0,
      alive: true,
      isBot: isBot,
      email: email,
      dbConsumed: false
    });
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
  level: 'uint8',
  money: 'uint8',
  life: 'uint8',
  shopLocked: 'boolean',
  streak: 'uint8',
  interest: 'uint8',
  lastBattleResult: 'string',
  opponentName: 'string',
  boardSize: 'uint8',
  stuff: Stuff
});

module.exports = Player;
