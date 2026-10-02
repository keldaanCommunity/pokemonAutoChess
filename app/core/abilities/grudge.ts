import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class GrudgeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const duration = 3000
    const damage = [18, 36, 52, 104][pokemon.stars - 1] ?? 104

    // Apply SILENCE status to the target
    target.status.triggerSilence(duration, target, pokemon)

    // Deal damage to all enemies affected by SILENCE
    board.cells
      .filter(
        (enemy): enemy is PokemonEntity =>
          !!enemy && enemy.team !== pokemon.team && enemy.status.silence
      )
      .forEach((enemy) => {
        pokemon.broadcastAbility({
          positionX: pokemon.positionX,
          positionY: pokemon.positionY,
          targetX: enemy.positionX,
          targetY: enemy.positionY
        })
        enemy.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      })
  }
}
