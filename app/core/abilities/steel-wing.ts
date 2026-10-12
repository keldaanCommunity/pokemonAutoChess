import { AttackType } from "../../types/enum/Game"
import { Item } from "../../types/enum/Item"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SteelWingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = ([10, 20, 40, 80][pokemon.stars - 1] ?? 80) + 2 * pokemon.def
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit: Set<PokemonEntity> = new Set()

    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          pokemon.broadcastAbility({ positionX: cell.x, positionY: cell.y })
          targetsHit.add(cell.value)
        }
      })

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board, false)
    }

    if (targetsHit.size === 0) targetsHit.add(target) // ensure to at least hit the target
    targetsHit.forEach((enemy) => {
      if (enemy.items.has(Item.TWIST_BAND) === false) {
        pokemon.addDefense(1, pokemon, 0, false)
        enemy.addDefense(-1, pokemon, 0, false)
      }
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
