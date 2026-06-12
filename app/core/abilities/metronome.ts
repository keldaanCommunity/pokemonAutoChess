import { getPokemonData } from "../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "../../models/precomputed/precomputed-rarity"
import { Transfer } from "../../types"
import { Rarity } from "../../types/enum/Game"
import type { DisplayText } from "../../types/strings/DisplayText"
import { pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategies } from "./abilities"
import { AbilityStrategy } from "./ability-strategy"

export class MetronomeStrategy extends AbilityStrategy {
  copyable = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const threshold = Math.pow(Math.random(), 1 + pokemon.luck / 100)
    let rarity = Rarity.COMMON
    if (threshold < 1 / 8) {
      rarity = Rarity.ULTRA
    } else if (threshold < 2 / 8) {
      rarity = Rarity.LEGENDARY
    } else if (threshold < 3 / 8) {
      rarity = Rarity.EPIC
    } else if (threshold < 4 / 8) {
      rarity = Rarity.UNIQUE
    } else if (threshold < 5 / 8) {
      rarity = Rarity.RARE
    } else if (threshold < 6 / 8) {
      rarity = Rarity.SPECIAL
    } else if (threshold < 7 / 8) {
      rarity = Rarity.UNCOMMON
    } else {
      rarity = Rarity.COMMON
    }

    const pokemonOptions = PRECOMPUTED_POKEMONS_PER_RARITY[rarity]
    if (rarity === Rarity.SPECIAL) {
      pokemonOptions.push(...PRECOMPUTED_POKEMONS_PER_RARITY[Rarity.HATCH])
    }

    const skillOptions = [
      ...new Set(pokemonOptions.map((p) => getPokemonData(p).skill))
    ]

    const skill = pickRandomIn(
      skillOptions.filter((s) => AbilityStrategies[s].copyable)
    )

    pokemon.broadcastAbility({ skill })
    AbilityStrategies[skill].process(pokemon, board, target, crit)

    pokemon.simulation.broadcastToSpectators(Transfer.DISPLAY_TEXT, {
      id: pokemon.simulation.id,
      text: `ability.${skill}` as DisplayText,
      x: pokemon.positionX,
      y: pokemon.positionY
    })
  }
}
