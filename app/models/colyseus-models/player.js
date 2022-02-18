const schema = require('@colyseus/schema');
const Pokemon = require('./pokemon').Pokemon;
const ExperienceManager = require('./experience-manager');
const Simulation = require('../../core/simulation');
const Synergies = require('./synergies');
const Effects = require('../effects');
const BattleResult = require('./battle-result');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;
const CollectionSchema = schema.CollectionSchema;
const { BATTLE_RESULT } = require('../enum');

class Player extends Schema {
  constructor(id, name, elo, avatar, isBot, rank, tileset) {
    super();
    this.opponents = [];
    this.assign({
      id: id,
      name: name,
      avatar: avatar,
      board: new MapSchema(),
      shop: new ArraySchema(),
      history: new ArraySchema(),
      items: new CollectionSchema(),
      itemsProposition: new ArraySchema(),
      experienceManager: new ExperienceManager(),
      synergies: new Synergies(),
      effects: new Effects(),
      money: process.env.MODE == 'dev' ? 400 : 5,
      life: process.env.MODE == 'dev' ? 50 : 100,
      simulation: new Simulation(),
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

  getCurrentBattleResult(){
    if(this.simulation.blueTeam.size == 0){
      return BATTLE_RESULT.DEFEAT
    }
    else if(this.simulation.redTeam.size == 0){
      return BATTLE_RESULT.WIN
    }
    return BATTLE_RESULT.DRAW
  }

  addBattleResult(name, result, avatar, isPVE) {
    if (this.history.length >= 5) {
      this.history.shift();
    }
    this.history.push(new BattleResult(name, result, avatar, isPVE));
  }

  getLastBattleResult() {
    if (this.history.length > 0) {
      return this.history[this.history.length - 1].result;
    } else {
      return '';
    }
  }

  getLastPlayerBattleResult() {


    for(let i = this.history.length - 1; i >= 0; i--){
      if(!this.history[i].isPVE){
        return this.history[i].result
      }
    }

    return ''
  }

  getPokemonAt(x, y) {
    for (const [id, pokemon] of this.board) {
      if (pokemon.positionX == x && pokemon.positionY == y) {
        return [pokemon, id];
      }
    }
    return null;
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
  items: {collection: 'string'},
  rank: 'uint8',
  exp: 'uint16',
  alive: 'boolean',
  elo: 'uint16',
  tileset: 'string',
  history: [BattleResult]
});

module.exports = Player;
