import { Pkm } from "../app/types/enum/Pokemon"
import PokemonFactory from "../app/models/pokemon-factory"
import fs from "fs"
import { Ability } from "../app/types/enum/Ability"
import { Synergy } from "../app/types/enum/Synergy"
import { Pokemon } from "../app/models/colyseus-models/pokemon"

const dataAll = {}
;(Object.keys(Synergy) as Synergy[]).forEach((type) => {
  const pokemons = new Array<Pokemon>()

  Object.values(Pkm).forEach((pkm) => {
    const pokemon = PokemonFactory.createPokemonFromName(pkm)
    if (pokemon.types.includes(type) && pokemon.skill != Ability.DEFAULT) {
      pokemons.push(pokemon)
    }
  })

  pokemons.sort(indexSort)
  dataAll[type] = pokemons.map((p) => p.name)
})

fs.writeFileSync(
  "../app/models/precomputed/type-pokemons-all.json",
  JSON.stringify(dataAll)
)

export function indexSort(a: Pokemon, b: Pokemon) {
  const aIndex = parseFloat(a.index.replace("-", "."))
  const bIndex = parseFloat(b.index.replace("-", "."))
  return aIndex - bIndex
}
