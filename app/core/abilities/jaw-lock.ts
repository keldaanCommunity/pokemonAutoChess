import { EffectEnum } from "../../types/enum/Effect"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class JawLockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const baseDamage = Math.round(pokemon.atk * 1.25)
    const bonusDamage = [10, 15, 20, 40][pokemon.stars - 1] ?? 40
    const totalDamage = baseDamage + bonusDamage
    const heal = [25, 50, 100, 200][pokemon.stars - 1] ?? 200

    // Check if target is already locked (already bitten)
    const alreadyBitten = target.effects.has(EffectEnum.JAW_LOCK)

    // Apply LOCKED status for 3 seconds
    target.status.triggerLocked(3000, target)
    target.effects.add(EffectEnum.JAW_LOCK)

    // Deal damage
    target.handleSpecialDamage(
      totalDamage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    // If target was already bitten, heal the user
    if (alreadyBitten) {
      pokemon.handleHeal(heal, pokemon, 1, crit)
    }
  }
}
