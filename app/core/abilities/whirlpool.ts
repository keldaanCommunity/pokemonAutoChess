import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class WhirlpoolStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const farthestTarget =
      pokemon.state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, board, farthestTarget, crit, true)
    const targetsHit: Set<PokemonEntity> = new Set()

    const cells = board.getCellsBetween(
      pokemon.positionX,
      pokemon.positionY,
      farthestTarget.positionX,
      farthestTarget.positionY
    )
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      if (cell && cell.value && cell.value.team !== pokemon.team) {
        targetsHit.add(cell.value)
        pokemon.broadcastAbility({ targetX: cell.x, targetY: cell.y })
        break // only first enemy in the line is hit
      }
    }

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      const multiplier = [1, 1, 1, 2][pokemon.stars - 1] ?? 2
      for (let i = 0; i < 4; i++) {
        enemy.handleSpecialDamage(
          pokemon.atk * multiplier,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}
