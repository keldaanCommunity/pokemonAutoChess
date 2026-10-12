import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class RagingBullStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    //Destroy barriers like PROTECT, REFLECT, MAGIC_BOUNCE while inflicting ARMOR_BREAK for 3 seconds, then deal [20,40,80,SP] SPECIAL to the target
    target.status.triggerArmorReduction(3000, pokemon)
    target.status.reflectCooldown = 0
    target.status.reflect = false
    target.status.protectCooldown = 0
    target.status.protect = false
    target.status.magicBounce = false
    target.status.magicBounceCooldown = 0
    const damage = [20, 40, 80, 160][pokemon.stars - 1] ?? 160
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}
