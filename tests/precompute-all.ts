import {PKM, TYPE, SPECIAL_SKILL} from '../app/models/enum';
import PokemonFactory from '../app/models/pokemon-factory';
import fs from 'fs';

const dataAll = {};
Object.keys(TYPE).forEach((type)=>{
  const pokemons = [];

  Object.values(PKM).forEach((pkm) => {
    const pokemon = PokemonFactory.createPokemonFromName(pkm);
    if (pokemon.types.includes(type) && pokemon.skill != SPECIAL_SKILL.DEFAULT) {
      pokemons.push(pkm);
    }
  });

  dataAll[type] = pokemons;
});

fs.writeFileSync('../app/models/precomputed/type-pokemons-all.json', JSON.stringify(dataAll));
