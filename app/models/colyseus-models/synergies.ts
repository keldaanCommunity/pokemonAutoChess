import {Schema, type, MapSchema} from '@colyseus/schema';
import PokemonFactory from '../pokemon-factory';
import {Pokemon} from '../colyseus-models/pokemon';

export interface ISynergies {
  NORMAL: number;
  GRASS: number;
  FIRE: number;
  WATER: number;
  ELECTRIC: number;
  FIGHTING: number;
  PSYCHIC: number;
  DARK: number;
  METAL: number;
  GROUND: number;
  POISON: number;
  DRAGON: number;
  FIELD: number;
  MONSTER: number;
  HUMAN: number;
  AQUATIC: number;
  BUG: number;
  FLYING: number;
  FLORA: number;
  MINERAL: number;
  GHOST: number;
  FAIRY: number;
  ICE: number;
  FOSSIL: number;
  SOUND: number;
}

export default class Synergies extends Schema implements ISynergies{
  @type('uint8') NORMAL: number;
  @type('uint8') GRASS: number;
  @type('uint8') FIRE: number;
  @type('uint8') WATER: number;
  @type('uint8') ELECTRIC: number;
  @type('uint8') FIGHTING: number;
  @type('uint8') PSYCHIC: number;
  @type('uint8') DARK: number;
  @type('uint8') METAL: number;
  @type('uint8') GROUND: number;
  @type('uint8') POISON: number;
  @type('uint8') DRAGON: number;
  @type('uint8') FIELD: number;
  @type('uint8') MONSTER: number;
  @type('uint8') HUMAN: number;
  @type('uint8') AQUATIC: number;
  @type('uint8') BUG: number;
  @type('uint8') FLYING: number;
  @type('uint8') FLORA: number;
  @type('uint8') MINERAL: number;
  @type('uint8') GHOST: number;
  @type('uint8') FAIRY: number;
  @type('uint8') ICE: number;
  @type('uint8') FOSSIL: number;
  @type('uint8') SOUND: number;

  update(board: MapSchema<Pokemon>) {
    const pokemonNames = [];
    this.setToZero();

    board.forEach((pkm: Pokemon) => {
      const family = PokemonFactory.getPokemonFamily(pkm.name);
      if (!pokemonNames.includes(family) && pkm.positionY != 0) {
        pokemonNames.push(family);
        pkm.types.forEach( (type) => {
          this[type] += 1;
        });
      }
    });
  }

  setToZero() {
    this.NORMAL = 0;
    this.GRASS = 0;
    this.NORMAL= 0;
    this.GRASS = 0;
    this.FIRE = 0;
    this.WATER = 0;
    this.ELECTRIC = 0;
    this.FIGHTING = 0;
    this.PSYCHIC = 0;
    this.DARK = 0;
    this.METAL = 0;
    this.GROUND = 0;
    this.POISON = 0;
    this.DRAGON = 0;
    this.FIELD = 0;
    this.MONSTER = 0;
    this.HUMAN = 0;
    this.AQUATIC = 0;
    this.BUG = 0;
    this.FLYING = 0;
    this.FLORA = 0;
    this.MINERAL = 0;
    this.GHOST = 0;
    this.FAIRY= 0;
    this.ICE = 0;
    this.FOSSIL = 0;
    this.SOUND = 0;
  }
}
