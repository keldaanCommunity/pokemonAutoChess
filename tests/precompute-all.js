const PKM = require('../app/models/enum').PKM;
const TYPE = require('../app/models/enum').TYPE;
const SPECIAL_SKILL = require('../app/models/enum').SPECIAL_SKILL;
const PokemonFactory = require('../app/models/pokemon-factory');


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

console.log(dataAll);

