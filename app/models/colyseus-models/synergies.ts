import {Schema, type, MapSchema} from '@colyseus/schema';
import PokemonFactory from '../pokemon-factory';
import { IPokemon, ISynergies } from '../../types';
import { Synergy } from '../../types/enum/Synergy';

export default class Synergies extends Schema implements ISynergies{

  @type({map: 'uint8'}) syns = new MapSchema<number>();

  constructor(){
    super();

    Object.values(Synergy).forEach((key) => {
      this.syns.set(key, 0)
    })
    this.setToZero();
  }

  update(board: MapSchema<IPokemon>) {
    const pokemonNames = [];
    this.setToZero();


    board.forEach((pkm: IPokemon) => {
      const family = PokemonFactory.getPokemonFamily(pkm.name);
      if (!pokemonNames.includes(family) && pkm.positionY != 0) {
        pokemonNames.push(family);
        pkm.types.forEach( (type) => {
          this.syns.set(type, this.syns.get(type) + 1)
        });
      }
    });

  }

  setToZero() {
    this.syns.forEach((value, key) => {
      this.syns.set(key, 0)
    })
  }

  get(synergy: Synergy){
    return this.syns.get(synergy)
  }

  printSynergies() {
    this.syns.forEach((value, key) => {
      console.log('synergies: ', key, value)
    })
  }

  getSynergies() {
    const result = {}

    this.syns.forEach((value, key) => {
      result[key] = value
    })

    return result
  }
}
