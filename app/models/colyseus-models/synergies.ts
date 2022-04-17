import {Schema, type, MapSchema} from '@colyseus/schema';
import PokemonFactory from '../pokemon-factory';
import { IPokemon } from '../../types';
import { Synergy } from '../../types/enum/Synergy';

export default class Synergies extends MapSchema<number> implements Map<string,number>{

  constructor(){
    super();
    Object.keys(Synergy).forEach((key) => {this.set(key,0)});
  }

  update(board: MapSchema<IPokemon>) {
    const pokemonNames = [];
    this.setToZero();


    board.forEach((pkm: IPokemon) => {
      const family = PokemonFactory.getPokemonFamily(pkm.name);
      if (!pokemonNames.includes(family) && pkm.positionY != 0) {
        pokemonNames.push(family);
        pkm.types.forEach( (type) => {
          this.set(type, this.get(type) + 1)
        });
      }
    });

  }

  setToZero() {
    this.forEach((value, key) => {this.set(key, 0)});
  }

}
