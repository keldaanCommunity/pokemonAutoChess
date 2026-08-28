import { EffectConfigs } from "../../config/game/effects"
import { StatusConfigs } from "../../config/game/statuses"
import { getActiveSynergyTier } from "../../config/game/synergies"
import { AttackType } from "../../types/enum/Game"
import { Status } from "../../types/enum/Status"
import { Synergy } from "../../types/enum/Synergy"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class PoisonStingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const poisonEffect = getActiveSynergyTier(Synergy.POISON, pokemon.effects)
    const poisonConfig = poisonEffect ? EffectConfigs[poisonEffect] : undefined
    const maxStacksBonus =
      poisonConfig && "maxStacksBonus" in poisonConfig
        ? poisonConfig.maxStacksBonus
        : 0
    const maxStacks = StatusConfigs[Status.POISONNED].maxStacks + maxStacksBonus

    const nbStacksToApply = [2, 3, 4, 5][pokemon.stars - 1] ?? 5
    const currentStacks = target.status.poisonStacks
    const extraDamage =
      currentStacks + nbStacksToApply > maxStacks
        ? (currentStacks + nbStacksToApply - maxStacks) *
          ([25, 50, 100, 150][pokemon.stars - 1] ?? 150)
        : 0
    for (let i = 0; i < nbStacksToApply; i++) {
      target.status.triggerPoison(4000, target, pokemon)
    }
    if (extraDamage > 0) {
      target.handleSpecialDamage(
        extraDamage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
  }
}
