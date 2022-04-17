import {PKM} from '../app/models/enum';
import PokemonFactory from '../app/models/pokemon-factory';
import fs from 'fs';
import { Ability } from '../app/types/enum/Ability';
import {Synergy} from '../app/types/enum/Synergy';
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
    if (pokemon.rarity == rarity && pokemon.skill != Ability.DEFAULT) {
      pokemonCandidates.push(pokemon);
      names.push(pkm);
    }
  });
  colyseusData[rarity] = pokemonCandidates;
  data[rarity] = names;
});


console.log(data);

fs.writeFileSync('../app/models/precomputed/type-rarity-all.json', JSON.stringify(data));
