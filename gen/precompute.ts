import { Ability } from '../app/types/enum/Ability'
import { Rarity } from '../app/types/enum/Game'
import {Pkm, PkmFamily} from '../app/types/enum/Pokemon'
import PokemonFactory from '../app/models/pokemon-factory'
import fs from 'fs'
import { Synergy } from '../app/types/enum/Synergy'
import { RarityHpCost } from '../app/types/Config'
import { Pokemon } from '../app/models/colyseus-models/pokemon'

const data = {
  NORMAL: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  },
  GRASS: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  },
  FIRE: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  },
  WATER: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  },
  ELECTRIC: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  },
  FIGHTING: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  },
  PSYCHIC: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  },
  DARK: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  },
  METAL: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  },
  GROUND: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  },
  POISON: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  },
  DRAGON: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  },
  FIELD: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  },
  MONSTER: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  },
  HUMAN: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  },
  AQUATIC: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  },
  BUG: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  },
  FLYING: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  },
  FLORA: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  },
  MINERAL: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  },
  GHOST: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  },
  FAIRY: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  },
  ICE: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  },
  FOSSIL: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  },
  SOUND: {
    pokemons: new Array<string>(),
    mythicalPokemons: new Array<string>()
  }
};

(Object.keys(Synergy) as Synergy[]).forEach((type)=>{
  const pokemonCandidates = new Array<Pokemon>()
  const mythicalPokemonCandidates = new Array<Pokemon>()

  Object.values(Pkm).forEach((pkm) => {
    const pokemon = PokemonFactory.createPokemonFromName(pkm)
    const family = PkmFamily[pkm]
    if (pokemon.rarity != Rarity.NEUTRAL && pokemon.skill != Ability.DEFAULT) {
      if (pokemon.types.includes(type)) {
        if (pokemon.rarity == Rarity.MYTHICAL) {
          mythicalPokemonCandidates.push(pokemon)
        } else {
          let included = false
          pokemonCandidates.forEach((candidate) =>{
            if (PkmFamily[candidate.name] == family) {
              included = true
            }
          })
          if (!included) {
            pokemonCandidates.push(pokemon)
          }
        }
      }
    }
  })

  pokemonCandidates.sort(function(a, b) {
    return RarityHpCost[a.rarity] - RarityHpCost[b.rarity]
  })

  pokemonCandidates.forEach((p)=>{
    data[type].pokemons.push(p.name)
  })
  mythicalPokemonCandidates.forEach((p)=>{
    data[type].mythicalPokemons.push(p.name)
  })
})

console.log(data)

fs.writeFileSync('../app/models/precomputed/type-pokemons.json', JSON.stringify(data))
