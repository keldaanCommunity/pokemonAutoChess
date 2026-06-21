import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class CoreEnforcerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const cellsHit = board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .filter(
        (cell) => cell.y !== target.positionY || cell.x === target.positionX
      ) // Z shape

    const damage = [40, 60, 80, 160][pokemon.stars - 1] ?? 160
    cellsHit.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.status.triggerSilence(3000, cell.value)
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit,
          true
        )
      }
    })
  }
}
