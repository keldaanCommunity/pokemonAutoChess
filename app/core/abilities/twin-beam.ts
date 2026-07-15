import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import { effectInLine } from "../board"

import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class TwinBeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Fires out two beams that hit the furthest enemies, dealing 30/60 special damage to all enemies in a line.
    const damage = [30, 60, 100, 200][pokemon.stars - 1] ?? 200
    const farthestTarget = pokemon.state.getFarthestTarget(pokemon, board)
    if (farthestTarget) {
      effectInLine(board, pokemon, farthestTarget, (cell) => {
        if (cell.value != null && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
      pokemon.broadcastAbility({
        skill: Ability.TWIN_BEAM,
        targetX: farthestTarget.positionX,
        targetY: farthestTarget.positionY
      })

      const oppositeFarthestTarget = pokemon.state.getFarthestTarget(
        farthestTarget,
        board,
        pokemon
      )
      if (oppositeFarthestTarget) {
        effectInLine(board, pokemon, oppositeFarthestTarget, (cell) => {
          if (cell.value != null && cell.value.team !== pokemon.team) {
            cell.value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        })
        pokemon.broadcastAbility({
          skill: Ability.TWIN_BEAM,
          targetX: oppositeFarthestTarget.positionX,
          targetY: oppositeFarthestTarget.positionY
        })
      }
    }
  }
}
