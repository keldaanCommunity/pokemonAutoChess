import { AttackType } from "../../types/enum/Game"
import { distanceC } from "../../utils/distance"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ShockwaveStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 120, 240][pokemon.stars - 1] ?? 240
    const range = 2 + (pokemon.status.electricField ? 1 : 0)
    board
      .getCellsInRadius(pokemon.positionX, pokemon.positionY, range, false)
      .forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          const distance = distanceC(
            pokemon.positionX,
            pokemon.positionY,
            cell.x,
            cell.y
          )
          const damageMultiplier = 1 - 0.2 * distance
          cell.value.handleSpecialDamage(
            Math.round(damage * damageMultiplier),
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
  }
}
