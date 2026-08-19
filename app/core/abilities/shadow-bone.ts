import { AttackType } from "../../types/enum/Game"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import { effectInLine } from "../board"

import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ShadowBoneStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 120, 240][pokemon.stars - 1] ?? 240

    const hit = () =>
      effectInLine(board, pokemon, target, (cell) => {
        if (cell.value != null && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )

          if (chance(0.5, pokemon)) {
            cell.value.addDefense(-6, pokemon, 1, crit)
          }
        }
      })

    hit()
  }
}
