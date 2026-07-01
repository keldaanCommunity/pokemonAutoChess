import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class RockWreckerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // inflict FLINCH for 2 seconds then [80,160,SP] SPECIAL. Then user gets FATIGUE for 4 seconds
    const damage = [80, 160, 320, 640][pokemon.stars - 1] ?? 640
    target.status.triggerFlinch(2000, pokemon)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.status.triggerFatigue(4000, pokemon, pokemon)
  }
}
