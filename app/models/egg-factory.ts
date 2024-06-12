import { PokemonActionState } from "../types/enum/Game"
import { Pkm } from "../types/enum/Pokemon"
import { pickRandomIn } from "../utils/random"
import Player from "./colyseus-models/player"
import { Egg } from "./colyseus-models/pokemon"
import PokemonFactory from "./pokemon-factory"
import { getPokemonData } from "./precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "./precomputed/precomputed-rarity"

export function createRandomEgg(shiny: boolean, player?: Player): Egg {
  const hatchList = PRECOMPUTED_POKEMONS_PER_RARITY.HATCH.filter(
    (p) => getPokemonData(p).stars === 1
  )
  const egg = PokemonFactory.createPokemonFromName(Pkm.EGG, {
    selectedShiny: shiny
  })
  egg.action = PokemonActionState.SLEEP

  if (player) {
    const remainingEggs = hatchList.filter(
      (p) => !player.randomEggsGiven.includes(p)
    )
    egg.evolution = pickRandomIn(
      remainingEggs.length > 0 ? remainingEggs : hatchList
    )
    player.randomEggsGiven.push(egg.evolution)
  } else {
    egg.evolution = pickRandomIn(hatchList)
  }

  return egg as Egg
}
