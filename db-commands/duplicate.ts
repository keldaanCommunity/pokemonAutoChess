import PokemonFactory from "../app/models/pokemon-factory"
import { Ability } from "../app/types/enum/Ability"
import { Pkm, PkmFamily } from "../app/types/enum/Pokemon"

const summary = new Map<Ability, Pkm[]>()

Object.values(Pkm).forEach((pkm) => {
  const pokemon = PokemonFactory.createPokemonFromName(pkm)
  const pokemons = summary.get(pokemon.skill)
  if (pokemon.skill !== Ability.DEFAULT) {
    if (pokemons) {
      if (!pokemons.includes(PkmFamily[pokemon.name])) {
        pokemons.push(pokemon.name)
      }
    } else {
      summary.set(pokemon.skill, [pokemon.name])
    }
  }
})

summary.forEach((values, k) => {
  if (values.length <= 2) {
    summary.delete(k)
  }
})

console.log(summary)
