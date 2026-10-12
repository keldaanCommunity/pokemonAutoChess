import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SnipeShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const damage = [40, 80, 160, 320][pokemon.stars - 1] ?? 320
    const farthestTarget =
      pokemon.state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, board, farthestTarget, crit)
    const targetsHit: Set<PokemonEntity> = new Set()

    if (farthestTarget) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestTarget.positionX,
        farthestTarget.positionY
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          targetsHit.add(cell.value)
        }
      })
    }

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
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
