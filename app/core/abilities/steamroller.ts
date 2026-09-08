import { AttackType } from "../../types/enum/Game"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SteamrollerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = Math.round(
      ([0.4, 0.8, 1.5, 3.0][pokemon.stars - 1] ?? 3.0) * pokemon.speed
    )

    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit = new Set<PokemonEntity>()

    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell, i) => {
        if (cell.value && cell.value.team != pokemon.team) {
          targetsHit.add(cell.value)
        }
      })
      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board, false)
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
      if (chance(0.5, pokemon)) {
        enemy.status.triggerFlinch(3000, enemy, pokemon)
      }
    })
  }
}
