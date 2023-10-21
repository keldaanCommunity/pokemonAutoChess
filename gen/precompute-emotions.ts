import tracker from "../app/public/dist/client/assets/pokemons/tracker.json"
import PokemonFactory from "../app/models/pokemon-factory"
import { Pkm } from "../app/types/enum/Pokemon"
import fs from "fs"
import { Emotion } from "../app/types/enum/Emotion"
import { mapToObj } from "../app/utils/map"

const data = new Map<string, number[]>()
const emotions = Object.values(Emotion)

Object.values(Pkm).map((pkm) => {
  const pokemon = PokemonFactory.createPokemonFromName(pkm)
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
  "../app/models/precomputed/emotions.json",
  JSON.stringify(mapToObj(data))
)
