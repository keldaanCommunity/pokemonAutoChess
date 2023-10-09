import PokemonFactory from "../app/models/pokemon-factory"
import { Pkm } from "../app/types/enum/Pokemon"
import fs from "fs"

const data = new Map<Pkm, number>()

Object.values(Pkm).map((v) => {
  data.set(v, PokemonFactory.createPokemonFromName(v).stars)
})

function mapToObj(map) {
  const obj = {}
  for (const [k, v] of map) obj[k] = v
  return obj
}

fs.writeFileSync(
  "../app/models/precomputed/stars.json",
  JSON.stringify(mapToObj(data))
)
