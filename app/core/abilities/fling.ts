import { Item } from "../../types"
import { AttackType } from "../../types/enum/Game"
import { Synergy } from "../../types/enum/Synergy"
import { distanceM } from "../../utils/distance"
import type { Board } from "../board"
import { effectInLine } from "../board"

import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class FlingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    if (pokemon.items.has(Item.BALL)) {
      // When throwing the BALL, all enemies in between user and receiver take [30,SP]% of user's SPEED as SPECIAL.
      let receiver: PokemonEntity | null = null
      let maxDistance = 0

      const fieldAllies = board.cells.filter<PokemonEntity>(
        (p): p is PokemonEntity =>
          p != null &&
          p.id !== pokemon.id &&
          p.team === pokemon.team &&
          p.items.size < 3 &&
          p.items.has(Item.BALL) === false &&
          p.hasSynergy(Synergy.FIELD)
      )

      let furthestFieldAlly: PokemonEntity | null = null

      for (const ally of fieldAllies) {
        const distance = distanceM(
          ally.positionX,
          ally.positionY,
          pokemon.positionX,
          pokemon.positionY
        )
        if (distance > maxDistance) {
          furthestFieldAlly = ally
          maxDistance = distance
        }
      }

      if (furthestFieldAlly) {
        receiver = furthestFieldAlly
      } else {
        // If no FIELD ally with a free item slot at sight, throws the ball to the furthest enemy instead,
        // dealing [30,SP]% of user's SPEEED as PHYSICAL

        const enemies = board.cells.filter<PokemonEntity>(
          (p): p is PokemonEntity => p != null && p.team !== pokemon.team
        )
        let furthestEnemy: PokemonEntity | null = null
        let maxDistance = 0
        for (const enemy of enemies) {
          const distance = distanceM(
            enemy.positionX,
            enemy.positionY,
            pokemon.positionX,
            pokemon.positionY
          )
          if (distance > maxDistance) {
            furthestEnemy = enemy
            maxDistance = distance
          }
        }

        if (furthestEnemy) {
          receiver = furthestEnemy
        }
      }

      if (receiver) {
        const damageFactor = [0.3, 0.3, 0.3, 1][pokemon.stars - 1] ?? 1
        const damage = Math.round(damageFactor * pokemon.speed)
        effectInLine(board, pokemon, receiver, (cell) => {
          if (cell.value && cell.value.team !== pokemon.team) {
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
    } else {
      // If not holding a BALL, jump in a corner of the board and get a new BALL instead
      const corner = board.getTeleportationCell(
        pokemon.positionX,
        pokemon.positionY,
        pokemon.team
      )
      if (corner) {
        pokemon.moveTo(corner.x, corner.y, board, false)
        pokemon.commands.push(
          new DelayedCommand(() => {
            pokemon.addItem(Item.BALL)
          }, 100)
        )
      }
    }
  }
}
