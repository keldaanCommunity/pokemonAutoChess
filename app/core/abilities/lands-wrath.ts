import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class LandsWrathStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const atkDamage = Math.round(pokemon.atk * ([100, 100, 100, 200][pokemon.stars - 1] ?? 200) / 100 * (1 + pokemon.ap / 100))
    const cells = board.getAdjacentCells(
      target.positionX,
      target.positionY,
      true
    )

    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          ([20, 30, 40, 80][pokemon.stars - 1] ?? 80) + atkDamage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit,
          false
        )
        cell.value.addDefense(-([5, 5, 5, 10][pokemon.stars - 1] ?? 10), pokemon, 1, crit)
        cell.value.addSpecialDefense(-([5, 5, 5, 10][pokemon.stars - 1] ?? 10), pokemon, 1, crit)
        pokemon.broadcastAbility({
          skill: "LANDS_WRATH/hit",
          positionX: cell.x,
          positionY: cell.y
        })
      }
    })
  }
}
