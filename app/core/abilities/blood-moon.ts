import { AttackType } from "../../types/enum/Game"
import { type Board, effectInLine } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class BloodMoonStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damageMutiplier = [2, 2, 2, 4][pokemon.stars - 1] ?? 4
    const damage = Math.round(damageMutiplier * pokemon.atk)
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerWound(3000, cell.value, pokemon)
      }
    })
  }
}
