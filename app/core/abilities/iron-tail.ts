import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class IronTailStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.round(([1, 1, 1, 2][pokemon.stars - 1] ?? 2) * pokemon.def)
    const cellsHit = board.getCellsInFront(pokemon, target, 1)

    for (const cell of cellsHit) {
      if (cell.value && cell.value.team !== pokemon.team) {
        const orientation = board.orientation(
          pokemon.positionX,
          pokemon.positionY,
          cell.value.positionX,
          cell.value.positionY,
          pokemon,
          undefined
        )
        const destination = board.getKnockBackPlace(
          cell.value.positionX,
          cell.value.positionY,
          orientation
        )

        if (destination) {
          cell.value.moveTo(destination.x, destination.y, board, true)
          cell.value.cooldown = 500
        }
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    }
  }
}
