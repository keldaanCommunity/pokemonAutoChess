import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ProtectStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const flatDuration = [500, 1500, 2500, 4000][pokemon.stars - 1] ?? 4000
    const durationWithAP = flatDuration * (2 + pokemon.ap / 100)
    const critScalingFactor = 0.5
    const duration = Math.round(
      durationWithAP *
        (crit ? 1 + (pokemon.critPower - 1) * critScalingFactor : 1)
    )
    pokemon.status.triggerProtect(duration)
  }
}
