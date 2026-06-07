import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ToxicStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const factor = 0.5
    const baseDuration = [3000, 6000, 9000, 18000][pokemon.stars - 1] ?? 18000
    const duration = Math.round(
      baseDuration *
        (1 + (pokemon.ap / 100) * factor) *
        (crit ? 1 + (pokemon.critPower - 1) * factor : 1)
    )
    const count = [1, 2, 3, 4][pokemon.stars - 1] ?? 4

    const closestEnemies = board.getClosestEnemies(
      pokemon.positionX,
      pokemon.positionY,
      target.team
    )

    for (let i = 0; i < count; i++) {
      const enemy = closestEnemies[i]
      if (enemy) {
        enemy.status.triggerPoison(duration, enemy, pokemon)
      }
    }
  }
}
