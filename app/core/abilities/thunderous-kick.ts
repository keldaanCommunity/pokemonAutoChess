import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import { effectInOrientation } from "../board"

import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ThunderousKickStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 40, 60, 120][pokemon.stars - 1] ?? 120
    const defenseDebuff = 10

    let isBlocked = !target.canBeMoved
    let farthestReached: { x: number; y: number } = {
      x: target.positionX,
      y: target.positionY
    }
    const enemiesHit = new Set<PokemonEntity>()
    enemiesHit.add(target)
    effectInOrientation(board, pokemon, target, (cell) => {
      if (isBlocked) return
      if (
        cell.value &&
        cell.value.team !== pokemon.team &&
        cell.value.id !== target.id
      ) {
        enemiesHit.add(cell.value)
        if (
          board.isOnBoard(cell.x - 1, cell.y) &&
          board.getEntityOnCell(cell.x - 1, cell.y) === undefined &&
          cell.value.canBeMoved
        ) {
          // unit in the path is moved to the left
          cell.value.moveTo(cell.x - 1, cell.y, board, true)
          cell.value.cooldown = 500
        } else if (
          board.isOnBoard(cell.x + 1, cell.y) &&
          board.getEntityOnCell(cell.x + 1, cell.y) === undefined &&
          cell.value.canBeMoved
        ) {
          // unit in the path is moved to the right
          cell.value.moveTo(cell.x + 1, cell.y, board, true)
          cell.value.cooldown = 500
        } else {
          // the path is blocked, stop the effect
          isBlocked = true
        }
      }

      if (!isBlocked) {
        farthestReached = cell
      }
    })

    if (
      farthestReached &&
      (farthestReached.x !== target.positionX ||
        farthestReached.y !== target.positionY)
    ) {
      board.swapCells(
        target.positionX,
        target.positionY,
        farthestReached.x,
        farthestReached.y
      )
    }

    enemiesHit.forEach((enemy) => {
      enemy.status.triggerFlinch(4000, pokemon)
      enemy.addDefense(-defenseDebuff, pokemon, 1, crit)
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.PHYSICAL,
        pokemon,
        crit
      )
    })
  }
}
