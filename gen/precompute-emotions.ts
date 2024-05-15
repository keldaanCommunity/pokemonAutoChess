import fs from "fs"
import tracker from "../app/public/dist/client/assets/pokemons/tracker.json"
import { Emotion } from "../app/types/enum/Emotion"
import { mapToObj } from "../app/utils/map"
import { precomputedPokemons } from "./precomputed-pokemons"

export function precomputeEmotions() {
  console.time("precompute-emotions")

  const data = new Map<string, number[]>()
  const emotions = Object.values(Emotion)

  precomputedPokemons.forEach((pokemon) => {
    const pathIndex = pokemon.index.split("-")
    const metadata =
      pathIndex.length == 1
        ? tracker[pokemon.index]
        : tracker[pathIndex[0]].subgroups[pathIndex[1]]

    data.set(
      pokemon.index,
      emotions.map((emotion) =>
        emotion in (metadata.portrait_files ?? {}) ? 1 : 0
      )
    )
  })

  fs.writeFileSync(
    "../app/models/precomputed/emotions-per-pokemon-index.json",
    JSON.stringify(mapToObj(data))
  )

  console.timeEnd("precompute-emotions")
}
