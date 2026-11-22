import { AttackType } from "../../types/enum/Game"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import { effectInLine } from "../board"

import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class PowderSnowStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // A snow mist is blown towards the target, dealing [20,40,80,SP] SPECIAL to all enemies in a line with [15,30,50,LK]% chance to FREEZE them for 2 seconds.
    const damage = [20, 40, 80, 160][pokemon.stars - 1] ?? 160
    const freezeChance = [0.15, 0.3, 0.5, 1.0][pokemon.stars - 1] ?? 1.0

    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )

        if (chance(freezeChance, pokemon)) {
          cell.value.status.triggerFreeze(2000, cell.value, pokemon)
        }
      }
    })
  }
}
