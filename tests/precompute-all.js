const PKM = require('../app/models/enum').PKM;
const TYPE = require('../app/models/enum').TYPE;
const PokemonFactory = require('../app/models/pokemon-factory');
import { Ability } from '../app/types/enum/Ability';

const dataAll = {};
Object.keys(TYPE).forEach((type)=>{
  const pokemons = [];

  Object.values(PKM).forEach((pkm) => {
    const pokemon = PokemonFactory.createPokemonFromName(pkm);
    if (pokemon.types.includes(type) && pokemon.skill != Ability.DEFAULT) {
      pokemons.push(pkm);
    }
  });

  dataAll[type] = pokemons;
});

console.log(dataAll);

