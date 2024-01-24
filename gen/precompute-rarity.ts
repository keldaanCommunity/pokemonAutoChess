import fs from "fs"
import { Pokemon } from "../app/models/colyseus-models/pokemon"
import { Rarity } from "../app/types/enum/Game"
import { precomputedPokemons } from "./precomputed-pokemons"

console.time("precompute-rarity")

const rarities = Object.keys(Rarity) as Rarity[]
const data = Object.fromEntries<Pokemon[]>(rarities.map((r) => [r, []])) as {
  [r in Rarity]: Pokemon[]
}

precomputedPokemons.forEach((pokemon) => {
  data[pokemon.rarity].push(pokemon)
})

for (const r in data) {
  data[r] = data[r].sort(indexSort).map((p) => p.name)
}

//logger.debug(data)

fs.writeFileSync(
  "../app/models/precomputed/pokemons-per-rarity.json",
  JSON.stringify(data)
)

console.timeEnd("precompute-rarity")

function indexSort(a: Pokemon, b: Pokemon) {
  const aIndex = parseFloat(a.index.replace("-", "."))
  const bIndex = parseFloat(b.index.replace("-", "."))
  return aIndex - bIndex
}
