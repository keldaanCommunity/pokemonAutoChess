import fs from "fs"
import { PokemonCredits } from "../app/core/credits"
import tracker from "../app/public/dist/client/assets/pokemons/tracker.json"
import { logger } from "../app/utils/logger"
import { mapToObj } from "../app/utils/map"
import { precomputedPokemons } from "./precomputed-pokemons"

const NON_PMD_PKM_INDEXES = [
  "0532-0002", // Pillar Wood
  "0533-0002", // Pillar Iron
  "0534-0002", // Pillar Concrete,
  "0025-9999", // Pikachu Surfer
]

export function precomputeCredits() {
  console.time("precompute-credits")

  const data = new Map<string, PokemonCredits>()

  precomputedPokemons.forEach((pokemon) => {
    const pathIndex = pokemon.index.split("-")
    const metadata =
      pathIndex.length == 1
        ? tracker[pokemon.index]
        : tracker[pathIndex[0]]?.subgroups[pathIndex[1]]
    if (metadata) {
      data.set(pokemon.index, {
        portrait_credit: metadata.portrait_credit,
        sprite_credit: metadata.sprite_credit
      })
    } else if (NON_PMD_PKM_INDEXES.includes(pokemon.index) === false) {
      logger.warn(`No tracker information for ${pokemon.index}`)
    }
  })

  fs.writeFileSync(
    "../app/models/precomputed/credits.json",
    JSON.stringify(mapToObj(data))
  )

  console.timeEnd("precompute-credits")
}
