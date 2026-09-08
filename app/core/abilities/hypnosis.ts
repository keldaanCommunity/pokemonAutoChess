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
      const flatDuration = [1000, 1750, 3000, 6000][pokemon.stars - 1] ?? 1000
      const durationWithAP = flatDuration * (2 + pokemon.ap / 100)
      const critScalingFactor = 0.5
      const duration = Math.round(
        durationWithAP *
          (crit ? 1 + (pokemon.critPower - 1) * critScalingFactor : 1)
      )
      farthestTarget.status.triggerSleep(duration, farthestTarget)
    }
  }
}
