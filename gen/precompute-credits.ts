import fs from "fs"
import { PokemonCredits } from "../app/core/credits"
import tracker from "../app/public/dist/client/assets/pokemons/tracker.json"
import { logger } from "../app/utils/logger"
import { mapToObj } from "../app/utils/map"
import { precomputedPokemons } from "./precomputed-pokemons"

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
    } else {
      logger.warn(`No tracker information for ${pokemon.index}`)
    }
  })

  fs.writeFileSync(
    "../app/models/precomputed/credits.json",
    JSON.stringify(mapToObj(data))
  )

  console.timeEnd("precompute-credits")
}
