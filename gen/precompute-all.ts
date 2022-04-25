import {Pkm} from '../app/types/enum/Pokemon';
import PokemonFactory from '../app/models/pokemon-factory';
import fs from 'fs';
import { Ability } from '../app/types/enum/Ability';
import {Synergy} from '../app/types/enum/Synergy';

const dataAll = {};
(Object.keys(Synergy) as Synergy[]).forEach((type)=>{
  const pokemons = [];

  Object.values(Pkm).forEach((pkm) => {
    const pokemon = PokemonFactory.createPokemonFromName(pkm);
    if (pokemon.types.includes(type) && pokemon.skill != Ability.DEFAULT) {
      pokemons.push(pkm);
    }
  });

  dataAll[type] = pokemons;
});

fs.writeFileSync('../app/models/precomputed/type-pokemons-all.json', JSON.stringify(dataAll));
