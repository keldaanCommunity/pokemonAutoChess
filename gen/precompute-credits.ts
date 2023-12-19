import tracker from "../app/public/dist/client/assets/pokemons/tracker.json"
import fs from "fs"
import { mapToObj } from "../app/utils/map"
import { PokemonCredits } from "../app/core/credits"
import { precomputedPokemons } from "./precomputed-pokemons"

console.time("precompute-credits")

const data = new Map<string, PokemonCredits>()

precomputedPokemons.forEach((pokemon) => {
  const pathIndex = pokemon.index.split("-")
  const metadata =
    pathIndex.length == 1
      ? tracker[pokemon.index]
      : tracker[pathIndex[0]].subgroups[pathIndex[1]]
  data.set(pokemon.index, {
    portrait_credit: metadata.portrait_credit,
    sprite_credit: metadata.sprite_credit
  })
})

fs.writeFileSync(
  "../app/models/precomputed/credits.json",
  JSON.stringify(mapToObj(data))
)

console.timeEnd("precompute-credits")
