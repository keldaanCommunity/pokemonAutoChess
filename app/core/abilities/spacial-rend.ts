import { BOARD_WIDTH } from "../../config"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SpacialRendStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 60, 100, 200][pokemon.stars - 1] ?? 200
    const rowToTarget = target.positionY
    const enemies = board.cells.filter(
      (p) => p && p.team !== pokemon.team && p.canBeMoved
    )
    const n = enemies.length
    for (let i = 0; i < Math.floor(n / 2); i++) {
      enemies[i]!.toMovingState()
      enemies[n - 1 - i]!.toMovingState()
      board.swapCells(
        enemies[i]!.positionX,
        enemies[i]!.positionY,
        enemies[n - 1 - i]!.positionX,
        enemies[n - 1 - i]!.positionY
      )
    }

    for (let x = 0; x < BOARD_WIDTH; x++) {
      const targetHit = board.getEntityOnCell(x, rowToTarget)
      if (targetHit && targetHit.team !== pokemon.team) {
        targetHit.handleSpecialDamage(
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
