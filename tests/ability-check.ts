import PokemonFactory from "../app/models/pokemon-factory"
import { Ability } from "../app/types/enum/Ability"
import { Pkm } from "../app/types/enum/Pokemon"

Object.values(Ability)
  .map((v) => {
    return {
      [v]: Object.values(Pkm)
        .map((pkm) => PokemonFactory.createPokemonFromName(pkm))
        .filter((pokemon) => pokemon.skill === v)
        .map((pokemon) => pokemon.name)
    }
  })
  .map((v) => {
    console.log(v)
  })
