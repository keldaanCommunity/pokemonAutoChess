import { BOARD_HEIGHT, BOARD_WIDTH } from "../../config"
import { AttackType } from "../../types/enum/Game"
import { randomBetween } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class FissureStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const numberOfRifts = [2, 3, 4, 6][pokemon.stars - 1] ?? 6
    const damage = [25, 50, 75, 100][pokemon.stars - 1] ?? 100
    for (let i = 0; i < numberOfRifts; i++) {
      const x = randomBetween(0, BOARD_WIDTH - 1)
      const y = randomBetween(0, BOARD_HEIGHT - 1)
      const cells = board.getAdjacentCells(x, y)
      cells.push({ x, y, value: board.getEntityOnCell(x, y) })

      cells.forEach((cell) => {
        if (cell && cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
        pokemon.broadcastAbility({ targetX: cell.x, targetY: cell.y })
      })
    }
  }
}
