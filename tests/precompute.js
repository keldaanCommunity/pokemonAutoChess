const RARITY = require('../app/models/enum').RARITY;
const RARITY_HP_COST = require('../app/models/enum').RARITY_HP_COST;
const SPECIAL_SKILL = require('../app/models/enum').SPECIAL_SKILL;
const PKM = require('../app/models/enum').PKM;
const TYPE = require('../app/models/enum').TYPE;
const PokemonFactory = require('../app/models/pokemon-factory');


const data = {
  NORMAL: {
    pokemons: [],
    mythicalPokemons: []
  },
  GRASS: {
    pokemons: [],
    mythicalPokemons: []
  },
  FIRE: {
    pokemons: [],
    mythicalPokemons: []
  },
  WATER: {
    pokemons: [],
    mythicalPokemons: []
  },
  ELECTRIC: {
    pokemons: [],
    mythicalPokemons: []
  },
  FIGHTING: {
    pokemons: [],
    mythicalPokemons: []
  },
  PSYCHIC: {
    pokemons: [],
    mythicalPokemons: []
  },
  DARK: {
    pokemons: [],
    mythicalPokemons: []
  },
  METAL: {
    pokemons: [],
    mythicalPokemons: []
  },
  GROUND: {
    pokemons: [],
    mythicalPokemons: []
  },
  POISON: {
    pokemons: [],
    mythicalPokemons: []
  },
  DRAGON: {
    pokemons: [],
    mythicalPokemons: []
  },
  FIELD: {
    pokemons: [],
    mythicalPokemons: []
  },
  MONSTER: {
    pokemons: [],
    mythicalPokemons: []
  },
  HUMAN: {
    pokemons: [],
    mythicalPokemons: []
  },
  AQUATIC: {
    pokemons: [],
    mythicalPokemons: []
  },
  BUG: {
    pokemons: [],
    mythicalPokemons: []
  },
  FLYING: {
    pokemons: [],
    mythicalPokemons: []
  },
  FLORA: {
    pokemons: [],
    mythicalPokemons: []
  },
  MINERAL: {
    pokemons: [],
    mythicalPokemons: []
  },
  AMORPH: {
    pokemons: [],
    mythicalPokemons: []
  },
  FAIRY: {
    pokemons: [],
    mythicalPokemons: []
  },
  ICE: {
    pokemons: [],
    mythicalPokemons: []
  },
  FOSSIL: {
    pokemons: [],
    mythicalPokemons: []
  },
  SOUND: {
    pokemons: [],
    mythicalPokemons: []
  }
};

Object.keys(TYPE).forEach((type)=>{
  const pokemonCandidates = [];
  const mythicalPokemonCandidates = [];

  Object.values(PKM).forEach((pkm) => {
    const pokemon = PokemonFactory.createPokemonFromName(pkm);
    const family = PokemonFactory.getPokemonFamily(pkm);
    if (pokemon.rarity != RARITY.NEUTRAL && pokemon.skill != SPECIAL_SKILL.DEFAULT) {
      if (pokemon.types.includes(type)) {
        if (pokemon.rarity == RARITY.MYTHICAL) {
          mythicalPokemonCandidates.push(pokemon);
        } else {
          let included = false;
          pokemonCandidates.forEach((candidate) =>{
            if (PokemonFactory.getPokemonFamily(candidate.name) == family) {
              included = true;
            }
          });
          if (!included) {
            pokemonCandidates.push(pokemon);
          }
        }
      }
    }
  });

  pokemonCandidates.sort(function(a, b) {
    return RARITY_HP_COST[a.rarity] - RARITY_HP_COST[b.rarity];
  });

  pokemonCandidates.forEach((p)=>{
    data[type].pokemons.push(p.name);
  });
  mythicalPokemonCandidates.forEach((p)=>{
    data[type].mythicalPokemons.push(p.name);
  });
});

console.log(data);
