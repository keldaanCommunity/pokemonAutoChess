import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class PsystrikeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [20, 40, 80, 160][pokemon.stars - 1] ?? 160
    const furthestTarget =
      pokemon.state.getFarthestTarget(pokemon, board) ?? target
    const targetsHit: Set<PokemonEntity> = new Set()
    pokemon.broadcastAbility({
      targetX: furthestTarget.positionX,
      targetY: furthestTarget.positionY
    })
    const cells = board.getCellsBetween(
      pokemon.positionX,
      pokemon.positionY,
      furthestTarget.positionX,
      furthestTarget.positionY
    )
    cells.forEach((cell) => {
      if (cell.value && cell.value.team != pokemon.team) {
        targetsHit.add(cell.value)
      }
    })

    if (targetsHit.size === 0) {
      targetsHit.add(furthestTarget) // guarantee at least the furthest target is hit
    }
    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )

      const teleportationCell = board.getTeleportationCell(
        enemy.positionX,
        enemy.positionY,
        enemy.team
      )
      if (teleportationCell) {
        enemy.moveTo(teleportationCell.x, teleportationCell.y, board, true)
      }
    })
  }
}
