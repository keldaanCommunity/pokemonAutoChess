import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import { effectInLine } from "../board"

import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class MoongeistBeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null) {
        if (cell.value.team !== pokemon.team) {
          cell.value.status.triggerParalysis(3000, cell.value, pokemon)
          cell.value.handleSpecialDamage(
            [60, 80, 100, 200][pokemon.stars - 1] ?? 200,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        } else if (cell.value.id !== pokemon.id) {
          cell.value.addShield([60, 80, 100, 200][pokemon.stars - 1] ?? 200, pokemon, 1, crit)
        }
      }
    })
  }
}
