import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class IngrainStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const heal = [15, 30, 60, 120][pokemon.stars - 1] ?? 120
    const damage = [15, 30, 60, 120][pokemon.stars - 1] ?? 120
    const lockedDuration = 4000

    const cells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      true
    )
    cells.forEach((cell) => {
      if (cell.value && pokemon.team == cell.value.team) {
        cell.value.handleHeal(heal, pokemon, 1, crit)
      } else if (cell.value && pokemon.team !== cell.value.team) {
        cell.value.status.triggerLocked(lockedDuration, cell.value)
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}
