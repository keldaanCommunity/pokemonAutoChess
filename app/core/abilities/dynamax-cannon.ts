import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import { effectInLine } from "../board"

import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class DynamaxCannonStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damageRatio = [0.3,0.4,0.5,0.7][pokemon.stars - 1] ?? 0.7

    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          Math.ceil(cell.value.maxHP * damageRatio),
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}
