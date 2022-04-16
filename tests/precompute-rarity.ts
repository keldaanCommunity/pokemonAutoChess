import {PKM, RARITY, SPECIAL_SKILL} from '../app/models/enum';
import PokemonFactory from '../app/models/pokemon-factory';
import fs from 'fs';

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
    if (pokemon.rarity == rarity && pokemon.skill != SPECIAL_SKILL.DEFAULT) {
      pokemonCandidates.push(pokemon);
      names.push(pkm);
    }
  });
  colyseusData[rarity] = pokemonCandidates;
  data[rarity] = names;
});


console.log(data);

fs.writeFileSync('../app/models/precomputed/type-rarity-all.json', JSON.stringify(data));
