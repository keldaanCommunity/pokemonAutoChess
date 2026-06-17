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
    const factor = 0.5
    const duration = Math.round(
      ([1000, 3000, 5000, 8000][pokemon.stars - 1] ?? 8000) *
        (1 + (pokemon.ap / 100) * factor) *
        (crit ? 1 + (pokemon.critPower - 1) * factor : 1)
    )
    pokemon.status.triggerProtect(duration)
  }
}
