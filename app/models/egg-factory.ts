import { PokemonActionState } from "../types/enum/Game"
import { Pkm } from "../types/enum/Pokemon"
import { pickRandomIn } from "../utils/random"
import { Egg } from "./colyseus-models/pokemon"
import PokemonFactory from "./pokemon-factory"
import { getPokemonData } from "./precomputed"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "./precomputed/precomputed-rarity"

export function createRandomEgg(shiny: boolean): Egg {
  const hatchList = PRECOMPUTED_POKEMONS_PER_RARITY.HATCH.filter(
    (p) => getPokemonData(p).stars === 1
  )
  const egg = PokemonFactory.createPokemonFromName(Pkm.EGG, {
    selectedShiny: shiny
  })
  egg.action = PokemonActionState.SLEEP
  egg.evolution = pickRandomIn(hatchList)
  return egg as Egg
}
