import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class PlayRoughStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    target.status.triggerCharm(2500, target, pokemon, false)
    target.handleSpecialDamage(
      [30, 60, 120, 240][pokemon.stars - 1] ?? 240,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
  }
}
