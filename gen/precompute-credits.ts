import tracker from "../app/public/dist/client/assets/pokemons/tracker.json"
import PokemonFactory from "../app/models/pokemon-factory"
import { Pkm } from "../app/types/enum/Pokemon"
import fs from "fs"
import { mapToObj } from "../app/utils/map"
import { PokemonCredits } from "../app/core/credits"

const data = new Map<string, PokemonCredits>()

Object.values(Pkm).map((pkm) => {
  const pokemon = PokemonFactory.createPokemonFromName(pkm)
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
