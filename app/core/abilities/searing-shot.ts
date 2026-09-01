import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SearingShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 40, 50, 100][pokemon.stars - 1] ?? 100
    const burnDuration = [3000, 3000, 3000, 6000][pokemon.stars - 1] ?? 6000
    const cells = board.getCellsInRadius(
      pokemon.positionX,
      pokemon.positionY,
      2,
      false
    )
    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerBurn(burnDuration, target, pokemon)
      }
    })
  }
}
