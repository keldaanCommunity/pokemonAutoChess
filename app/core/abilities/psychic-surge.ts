import { Synergy } from "../../types/enum/Synergy"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class PsychicSurgeStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (
        ally &&
        ally.id !== pokemon.id &&
        pokemon.team === ally.team &&
        ally.hasSynergy(Synergy.PSYCHIC)
      ) {
        ally.addShield(
          [20, 25, 30, 60][pokemon.stars - 1] ?? 60,
          pokemon,
          1,
          crit
        )
      }
    })
  }
}
