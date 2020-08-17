const schema = require('@colyseus/schema');
const Pokemon = require('./pokemon').Pokemon;
const ExperienceManager = require('./experience-manager');
const Simulation = require('../core/simulation');
const Synergies = require('./synergies');
const Effects = require('./effects');

const Schema = schema.Schema;
const MapSchema = schema.MapSchema;

class Player extends Schema {
  constructor(id, name) {
    super();
    this.id = id;
    this.name = name;
    this.board = new MapSchema();
    this.shop = new MapSchema();
    this.experienceManager = new ExperienceManager();
    this.synergies = new Synergies();
    this.effects = new Effects();
    this.money = 5;
    this.life = 20;
    this.simulation = new Simulation({}, {}, [], []);
    this.shopLocked = false;
    this.streak = 0;
    this.interest = 0;
    this.lastBattleResult = '';
    this.opponentName = '';
    this.boardSize = 0;
  }
}

schema.defineTypes(Player, {
  id: 'string',
  name: 'string',
  board: {map: Pokemon},
  shop: {map: Pokemon},
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
  boardSize: 'uint8'
});

module.exports = Player;
