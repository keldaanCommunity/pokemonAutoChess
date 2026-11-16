import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class WaveSplashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // User shrouds itself in water, gaining [20,SP]% of its max HP as SHIELD, then slams into the target with its whole body to inflict [20,SP]% of its max HP as SPECIAL
    const shieldPercent = [0.2, 0.2, 0.2, 0.5][pokemon.stars - 1] ?? 0.5
    const shieldAmount = Math.round(pokemon.maxHP * shieldPercent)
    pokemon.addShield(shieldAmount, pokemon, 1, crit)
    const damage = Math.round(pokemon.maxHP * shieldPercent)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}
