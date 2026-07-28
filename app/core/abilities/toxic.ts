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
    const flatDuration = [1500, 3000, 4500, 9000][pokemon.stars - 1] ?? 9000
    const durationWithAP = flatDuration * (2 + pokemon.ap / 100)
    const critScalingFactor = 0.5
    const duration = Math.round(
      durationWithAP *
        (crit ? 1 + (pokemon.critPower - 1) * critScalingFactor : 1)
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
