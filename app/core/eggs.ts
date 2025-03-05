import { EvolutionTime } from "../types/Config"
import { PokemonActionState } from "../types/enum/Game"
import { Pkm } from "../types/enum/Pokemon"
import { getFirstAvailablePositionInBench } from "../utils/board"
import { pickRandomIn } from "../utils/random"
import Player from "../models/colyseus-models/player"
import { Egg } from "../models/colyseus-models/pokemon"
import PokemonFactory from "../models/pokemon-factory"
import { getPokemonData } from "../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "../models/precomputed/precomputed-rarity"

export function createRandomEgg(player: Player, shiny: boolean): Egg {
  const hatchList = PRECOMPUTED_POKEMONS_PER_RARITY.HATCH.filter(
    (p) => getPokemonData(p).stars === 1
  )
  const egg = PokemonFactory.createPokemonFromName(Pkm.EGG, { shiny })
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

export function giveRandomEgg(
  player: Player,
  shiny = false,
  hatchTimer = EvolutionTime.EGG_HATCH
) {
  const egg = createRandomEgg(player, shiny)

  const x = getFirstAvailablePositionInBench(player.board)
  if (x !== undefined) {
    egg.positionX = x
    egg.positionY = 0
    egg.evolutionRule.evolutionTimer = hatchTimer
    player.board.set(egg.id, egg)
  }
}
