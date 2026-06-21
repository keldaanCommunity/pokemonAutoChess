import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class WickedBlowStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    // Deal 80AP true damage to the target. Always deal a critical hit.
    super.process(pokemon, board, target, true)
    const damage = [30, 45, 60, 120][pokemon.stars - 1] ?? 120
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, true)
  }
}
