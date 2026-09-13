import { AttackType } from "../../types/enum/Game"
import { chance } from "../../utils/random"
import { type Board, effectInLine } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class AuroraBeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [25, 50, 100, 200][pokemon.stars - 1] ?? 200
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        const freezeChance = 0.5
        if (chance(freezeChance, pokemon)) {
          cell.value.status.triggerFreeze(2000, target, pokemon)
        }
      }
    })
  }
}
