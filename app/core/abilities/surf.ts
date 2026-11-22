import { AttackType } from "../../types/enum/Game"
import { calcAngleDegrees } from "../../utils/number"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SurfStrategy extends AbilityStrategy {
  requiresTarget = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: null,
    crit: boolean,
    preventDefaultAnim?: boolean,
    tierLevel = pokemon.stars
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [20, 40, 80, 160][tierLevel - 1] ?? 160
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
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          // Push targets back 1 tile horizontally
          const surfAngle = calcAngleDegrees(
            farthestCoordinate.x - pokemon.positionX,
            farthestCoordinate.y - pokemon.positionY
          )
          const targetAngle = calcAngleDegrees(
            cell.value.positionX - pokemon.positionX,
            cell.value.positionY - pokemon.positionY
          )

          const dx =
            (surfAngle > 180 ? -1 : 1) * (targetAngle < surfAngle ? +1 : -1)

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

    if (targetsHit.size === 0 && farthestCoordinate?.target) {
      // ensure to at least hit the farthest target
      farthestCoordinate.target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
  }
}
