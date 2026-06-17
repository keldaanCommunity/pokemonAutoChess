import { AttackType } from "../../types/enum/Game"
import { calcAngleDegrees } from "../../utils/number"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class HeadlongRushStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const finalTargetDamage = [20, 40, 80, 160][pokemon.stars - 1] ?? 160
    const damageOnThePath = [10, 20, 30, 60][pokemon.stars - 1] ?? 60
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit: Set<PokemonEntity> = new Set()

    if (farthestCoordinate) {
      pokemon.broadcastAbility({
        targetX: farthestCoordinate.x,
        targetY: farthestCoordinate.y
      })
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          targetsHit.add(cell.value)
          cell.value.handleSpecialDamage(
            cell.value.id === farthestCoordinate.target.id
              ? finalTargetDamage
              : damageOnThePath,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )

          // Lose 1 def and spe def per enemy hit
          pokemon.addDefense(-1, pokemon, 0, false)
          pokemon.addSpecialDefense(-1, pokemon, 0, false)

          // Push targets back 1 tile horizontally
          const rushAngle = calcAngleDegrees(
            farthestCoordinate.x - pokemon.positionX,
            farthestCoordinate.y - pokemon.positionY
          )
          const targetAngle = calcAngleDegrees(
            cell.value.positionX - pokemon.positionX,
            cell.value.positionY - pokemon.positionY
          )

          const dx =
            (rushAngle > 180 ? -1 : 1) * (targetAngle < rushAngle ? +1 : -1)

          const newX = cell.x + dx
          if (
            board.isOnBoard(newX, cell.y) &&
            board.getEntityOnCell(newX, cell.y) === undefined
          ) {
            cell.value.moveTo(newX, cell.y, board, true)
            cell.value.cooldown = 500
          }
        }
      })

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board, false)
    }

    if (targetsHit.size === 0) {
      // ensure to at least hit the target
      target.handleSpecialDamage(
        finalTargetDamage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
  }
}
