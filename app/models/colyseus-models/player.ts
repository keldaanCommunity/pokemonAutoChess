import {Schema, type, MapSchema, ArraySchema, CollectionSchema} from '@colyseus/schema';
import {Pokemon} from './pokemon';
import Simulation from '../../core/simulation';
import Synergies from './synergies';
import {Effects} from '../effects';
import BattleResult from './battle-result';
import ExperienceManager from './experience-manager';
export default class Player extends Schema {
  @type('string') id: string;
  @type('string') name: string;
  @type('string') avatar: string;
  @type({map: Pokemon}) board = new MapSchema<Pokemon>();
  @type(['string']) shop = new ArraySchema<string>();
  @type(Simulation) simulation = new Simulation();
  @type(ExperienceManager) experienceManager = new ExperienceManager();
  @type(Synergies) synergies = new Synergies();
  @type(['string']) itemsProposition = new ArraySchema<string>();
  @type('uint8') money = process.env.MODE == 'dev' ? 400 : 5;
  @type('uint8') life = process.env.MODE == 'dev' ? 50 : 100;
  @type('boolean') shopLocked: boolean;
  @type('uint8') streak: number;
  @type('uint8') interest: number;
  @type('string') opponentName: string;
  @type('string') opponentAvatar: string;
  @type('uint8') boardSize: number;
  @type({collection: 'string'}) items = new CollectionSchema<string>();
  @type('uint8') rank: number;
  @type('uint16') exp: number;
  @type('uint16') elo: number;
  @type('boolean') alive = true;
  @type('string') tileset: string;
  @type([BattleResult]) history = new ArraySchema<BattleResult>();
  effects: Effects = new Effects();
  isBot: boolean;
  opponents: string[];


  constructor(id: string, name: string, elo: number, avatar: string, isBot: boolean, rank: number) {
    super();
    this.id = id;
    this.name = name;
    this.elo = elo;
    this.avatar = avatar;
    this.isBot = isBot;
    this.rank = rank;
  }

  getCurrentBattleResult() {
    /*
    if (this.simulation.blueTeam.size == 0) {
      return BATTLE_RESULT.DEFEAT;
    } else if (this.simulation.redTeam.size == 0) {
      return BATTLE_RESULT.WIN;
    }
    return BATTLE_RESULT.DRAW;
    */
  }

  addBattleResult(name: string, result: string, avatar: string, isPVE: boolean) {
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
    for (let i = this.history.length - 1; i >= 0; i--) {
      if (!this.history[i].isPVE) {
        return this.history[i].result;
      }
    }

    return '';
  }

  getPokemonAt(x: number, y: number) {
    let i:string = null;
    let p:Pokemon = null;

    this.board.forEach((pokemon, id)=>{
      if (pokemon.positionX == x && pokemon.positionY == y) {
        p = pokemon;
        i = id;
      }
    });
    return [p,i];
  }
}