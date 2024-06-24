import { precomputedPokemons } from "../../../gen/precomputed-pokemons"
import { Ability } from "../../types/enum/Ability"
import { Passive } from "../../types/enum/Passive"
import { Pkm } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { Pokemon } from "../colyseus-models/pokemon"

console.time("precompute-types")

const synergies = Object.keys(Synergy) as Synergy[]
const dataAll = Object.fromEntries<Pokemon[]>(
  synergies.map((s) => [s, []])
) as { [s in Synergy]: Pokemon[] }

precomputedPokemons
  .filter(
    (pokemon) =>
      pokemon.skill !== Ability.DEFAULT || pokemon.passive !== Passive.NONE
  )
  .forEach((pokemon) => {
    pokemon.types.forEach((type) => {
      dataAll[type].push(pokemon)
    })
  })

export const PRECOMPUTED_POKEMONS_PER_TYPE = {} as {
  [key in Synergy]: Pkm[]
}

for (const s in dataAll) {
  PRECOMPUTED_POKEMONS_PER_TYPE[s] = dataAll[s]
    .sort(indexSort)
    .map((p) => p.name)
}

function indexSort(a: Pokemon, b: Pokemon) {
  const aIndex = parseFloat(a.index.replace("-", "."))
  const bIndex = parseFloat(b.index.replace("-", "."))
  return aIndex - bIndex
}

console.timeEnd("precompute-types")
