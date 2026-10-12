import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class WonderGuardStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    const damage = [30, 60, 120, 240][pokemon.stars - 1] ?? 240

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.status.triggerParalysis(3000, cell.value, pokemon)
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
