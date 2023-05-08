import { Pkm } from "../app/types/enum/Pokemon"
import PokemonFactory from "../app/models/pokemon-factory"
import fs from "fs"
import { Ability } from "../app/types/enum/Ability"
import { Rarity } from "../app/types/enum/Game"
import { Pokemon } from "../app/models/colyseus-models/pokemon"
import { indexSort } from "./precompute-all"
import { logger } from "../app/utils/logger"

const data = {
  [Rarity.COMMON]: [],
  [Rarity.UNCOMMON]: [],
  [Rarity.RARE]: [],
  [Rarity.EPIC]: [],
  [Rarity.LEGENDARY]: [],
  [Rarity.MYTHICAL]: [],
  [Rarity.NEUTRAL]: [],
  [Rarity.SUMMON]: [],
  [Rarity.HATCH]: []
}

Object.keys(Rarity).forEach((rarity) => {
  const pokemonCandidates = new Array<Pokemon>()
  Object.values(Pkm).forEach((pkm) => {
    const pokemon = PokemonFactory.createPokemonFromName(pkm)
    if (pokemon.rarity == rarity && pokemon.skill != Ability.DEFAULT) {
      pokemonCandidates.push(pokemon)
    }
  })
  pokemonCandidates.sort(indexSort)
  data[rarity] = pokemonCandidates.map((p) => p.name)
})

logger.debug(data)

fs.writeFileSync(
  "../app/models/precomputed/type-rarity-all.json",
  JSON.stringify(data)
)
