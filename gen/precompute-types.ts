import fs from "fs"
import { Pokemon } from "../app/models/colyseus-models/pokemon"
import { Synergy } from "../app/types/enum/Synergy"
import { precomputedPokemons } from "./precomputed-pokemons"

console.time("precompute-types")

const synergies = Object.keys(Synergy) as Synergy[]
const dataAll = Object.fromEntries<Pokemon[]>(
  synergies.map((s) => [s, []])
) as { [s in Synergy]: Pokemon[] }

precomputedPokemons.forEach((pokemon) => {
  pokemon.types.forEach((type) => {
    dataAll[type].push(pokemon)
  })
})

for (const s in dataAll) {
  dataAll[s] = dataAll[s].sort(indexSort).map((p) => p.name)
}

fs.writeFileSync(
  "../app/models/precomputed/pokemons-per-type.json",
  JSON.stringify(dataAll)
)

function indexSort(a: Pokemon, b: Pokemon) {
  const aIndex = parseFloat(a.index.replace("-", "."))
  const bIndex = parseFloat(b.index.replace("-", "."))
  return aIndex - bIndex
}

console.timeEnd("precompute-types")
