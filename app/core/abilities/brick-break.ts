import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class BrickBreakStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damageMultiplier = [1.5, 1.5, 1.5, 3][pokemon.stars - 1] ?? 3
    const damage = damageMultiplier * pokemon.atk
    if (target.status.protect) {
      target.status.protect = false
      target.status.protectCooldown = 0
    }
    if (target.status.reflect) {
      target.status.reflect = false
      target.status.reflectCooldown = 0
    }
    if (target.status.magicBounce) {
      target.status.magicBounce = false
      target.status.magicBounceCooldown = 0
    }
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
    target.status.triggerArmorReduction(4000, target)
  }
}
