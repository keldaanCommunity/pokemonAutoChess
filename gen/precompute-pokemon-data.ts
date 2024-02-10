import fs from "fs"
import { IPokemonData } from "../app/types"
import { Pkm } from "../app/types/enum/Pokemon"
import { mapToObj } from "../app/utils/map"
import { precomputedPokemons } from "./precomputed-pokemons"

console.time("precompute-pokemon-data")

const data = new Map<Pkm, IPokemonData>()

precomputedPokemons.forEach((pokemon) => {
  data.set(pokemon.name, {
    stars: pokemon.stars,
    rarity: pokemon.rarity,
    additional: pokemon.additional,
    range: pokemon.range
  })
})

fs.writeFileSync(
  "../app/models/precomputed/pokemons-data.json",
  JSON.stringify(mapToObj(data))
)

console.timeEnd("precompute-pokemon-data")
