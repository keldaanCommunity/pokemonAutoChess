const RARITY = require('../app/models/enum').RARITY;
const PKM = require('../app/models/enum').PKM;
const SPECIAL_SKILL =require('../app/models/enum').SPECIAL_SKILL;
const PokemonFactory = require('../app/models/pokemon-factory');

const data = {
  COMMON: [],
  UNCOMMON: [],
  RARE: [],
  EPIC: [],
  LEGENDARY: [],
  MYTHICAL: [],
  NEUTRAL: [],
  SUMMON: []
};

const colyseusData = {
  COMMON: [],
  UNCOMMON: [],
  RARE: [],
  EPIC: [],
  LEGENDARY: [],
  MYTHICAL: [],
  NEUTRAL: [],
  SUMMON: []
};

Object.keys(RARITY).forEach((rarity)=>{
  const pokemonCandidates = [];
  const names = [];

  Object.values(PKM).forEach((pkm) => {
    const pokemon = PokemonFactory.createPokemonFromName(pkm);
    const family = PokemonFactory.getPokemonFamily(pkm);
    if (pokemon.rarity == rarity && pokemon.skill != SPECIAL_SKILL.DEFAULT) {
      let included = false;
      pokemonCandidates.push(pokemon);
      names.push(pkm);
    }
  });
  colyseusData[rarity] = pokemonCandidates;
  data[rarity] = names;
});


console.log(data);
