import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import { effectInOrientation } from "../board"

import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class FlameThrowerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 120, 240][pokemon.stars - 1] ?? 240

    effectInOrientation(
      board,
      pokemon,
      target,
      (cell) => {
        if (cell.value != null && cell.value.team != pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          cell.value.status.triggerBurn(4000, cell.value, pokemon)
        }
      },
      3
    )
  }
}
