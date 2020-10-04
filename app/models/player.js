const schema = require('@colyseus/schema');
const Pokemon = require('./pokemon').Pokemon;
const ExperienceManager = require('./experience-manager');
const Simulation = require('../core/simulation');
const Synergies = require('./synergies');
const Effects = require('./effects');
const Stuff = require('./stuff');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;

class Player extends Schema {
  constructor(id, name, avatar) {
    super();
    this.id = id;
    this.name = name;
    this.avatar = avatar;
    this.board = new MapSchema();
    this.shop = new MapSchema();
    this.stuff = new Stuff();
    this.experienceManager = new ExperienceManager();
    this.synergies = new Synergies();
    this.effects = new Effects();
    this.money = 250;
    this.life = 100;
    this.simulation = new Simulation({}, {}, [], []);
    this.shopLocked = false;
    this.streak = 0;
    this.interest = 0;
    this.lastBattleResult = '';
    this.opponentName = '';
    this.boardSize = 0;
    this.alive = true;
  }
}

schema.defineTypes(Player, {
  id: 'string',
  name: 'string',
  avatar: 'string',
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
  boardSize: 'uint8',
  stuff: Stuff
});

module.exports = Player;
