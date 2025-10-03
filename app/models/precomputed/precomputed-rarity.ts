import { precomputedPokemonsImplemented } from "../../../gen/precomputed-pokemons"
import { Rarity } from "../../types/enum/Game"
import { Pkm } from "../../types/enum/Pokemon"
import { Pokemon } from "../colyseus-models/pokemon"

console.time("precompute-rarity")

const rarities = Object.keys(Rarity) as Rarity[]
const data = Object.fromEntries<Pokemon[]>(rarities.map((r) => [r, []])) as {
  [r in Rarity]: Pokemon[]
}

precomputedPokemonsImplemented.forEach((pokemon) => {
  data[pokemon.rarity].push(pokemon)
})

//logger.debug(data)

export const PRECOMPUTED_POKEMONS_PER_RARITY = {} as {
  [key in Rarity]: Pkm[]
}

for (const r in data) {
  PRECOMPUTED_POKEMONS_PER_RARITY[r] = data[r]
    .sort(indexSort)
    .map((p) => p.name)
}

console.timeEnd("precompute-rarity")

function indexSort(a: Pokemon, b: Pokemon) {
  const aIndex = parseFloat(a.index.replace("-", "."))
  const bIndex = parseFloat(b.index.replace("-", "."))
  return aIndex - bIndex
}
