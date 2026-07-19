import { AbilityConfigs } from "../../config/game/abilities"
import { Ability } from "../../types/enum/Ability"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

const abilityConfig = AbilityConfigs[Ability.PROTECT]

export class ProtectStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const factor = abilityConfig.durationScalingFactor
    const baseDuration =
      this.computeValue(abilityConfig.duration, pokemon) * 1000
    const duration = Math.round(
      baseDuration *
        (1 + (pokemon.ap / 100) * factor) *
        (crit ? 1 + (pokemon.critPower - 1) * factor : 1)
    )
    pokemon.status.triggerProtect(duration)
  }
}
