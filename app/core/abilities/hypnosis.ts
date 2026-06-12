import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class HypnosisStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    const farthestTarget =
      pokemon.state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, board, farthestTarget, crit)
    if (farthestTarget) {
      const factor = 0.5
      const duration = Math.round(
        ([2000, 3500, 6000, 12000][pokemon.stars - 1] ?? 2000) *
          (1 + (pokemon.ap / 100) * factor) *
          (crit ? 1 + (pokemon.critPower - 1) * factor : 1)
      )
      farthestTarget.status.triggerSleep(duration, farthestTarget)
    }
  }
}
