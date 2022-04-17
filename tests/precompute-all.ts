const PKM = require('../app/models/enum').PKM;
const Synergy = require('../app/models/enum').Synergy;
const PokemonFactory = require('../app/models/pokemon-factory');
import { Ability } from '../app/types/enum/Ability';

const dataAll = {};
Object.keys(Synergy).forEach((type)=>{
  const pokemons = [];

  Object.values(PKM).forEach((pkm) => {
    const pokemon = PokemonFactory.createPokemonFromName(pkm);
    if (pokemon.types.includes(type) && pokemon.skill != Ability.DEFAULT) {
      pokemons.push(pkm);
    }
  });

  dataAll[type] = pokemons;
});

fs.writeFileSync('../app/models/precomputed/type-pokemons-all.json', JSON.stringify(dataAll));
