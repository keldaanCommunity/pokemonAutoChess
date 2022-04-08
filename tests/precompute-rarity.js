const PKM = require('../app/models/enum').PKM;
const SPECIAL_SKILL =require('../app/models/enum').SPECIAL_SKILL;
const PokemonFactory = require('../app/models/pokemon-factory');

import { Rarity } from '../app/types/enum/Game';
const data = {
  [Rarity.COMMON]: [],
  [Rarity.UNCOMMON]: [],
  [Rarity.RARE]: [],
  [Rarity.EPIC]: [],
  [Rarity.LEGENDARY]: [],
  [Rarity.MYTHICAL]: [],
  [Rarity.NEUTRAL]: [],
  [Rarity.SUMMON]: []
};

const colyseusData = {
  [Rarity.COMMON]: [],
  [Rarity.UNCOMMON]: [],
  [Rarity.RARE]: [],
  [Rarity.EPIC]: [],
  [Rarity.LEGENDARY]: [],
  [Rarity.MYTHICAL]: [],
  [Rarity.NEUTRAL]: [],
  [Rarity.SUMMON]: []
};

Object.keys(Rarity).forEach((rarity)=>{
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
