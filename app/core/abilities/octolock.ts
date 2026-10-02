import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class OctolockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 90, 180][pokemon.stars - 1] ?? 180
    const duration = [3000, 3000, 6000, 10000][pokemon.stars - 1] ?? 10000

    // Deal SPECIAL damage
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    // Apply LOCKED status for 3 seconds
    target.status.triggerLocked(duration, target)

    // Apply ARMOR_BREAK status for 3 seconds
    target.status.triggerArmorReduction(duration, target)
  }
}
