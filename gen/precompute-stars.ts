import fs from "fs"
import { Pkm } from "../app/types/enum/Pokemon"
import { mapToObj } from "../app/utils/map"
import { precomputedPokemons } from "./precomputed-pokemons"

console.time("precompute-stars")

const data = new Map<Pkm, number>()

precomputedPokemons.forEach((pokemon) => {
  data.set(pokemon.name, pokemon.stars)
})

fs.writeFileSync(
  "../app/models/precomputed/pokemons-stars.json",
  JSON.stringify(mapToObj(data))
)

console.timeEnd("precompute-stars")
