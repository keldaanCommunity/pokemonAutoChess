import PokemonFactory from "../app/models/pokemon-factory"
import { Pkm } from "../app/types/enum/Pokemon"
import fs from "fs"
import { mapToObj } from "../app/utils/map"

const data = new Map<Pkm, number>()

Object.values(Pkm).map((v) => {
  data.set(v, PokemonFactory.createPokemonFromName(v).stars)
})

fs.writeFileSync(
  "../app/models/precomputed/stars.json",
  JSON.stringify(mapToObj(data))
)
