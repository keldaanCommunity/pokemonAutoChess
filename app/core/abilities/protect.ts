import { getAbilityTierValue } from "../../config/game/ability-definitions/define-ability"
import protectDefinition from "../../config/game/ability-definitions/protect"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

const { balance } = protectDefinition

export class ProtectStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const factor = balance.durationScalingFactor
    const baseDuration = getAbilityTierValue(balance.durationMs, pokemon.stars)
    const duration = Math.round(
      baseDuration *
        (1 + (pokemon.ap / 100) * factor) *
        (crit ? 1 + (pokemon.critPower - 1) * factor : 1)
    )
    pokemon.status.triggerProtect(duration)
  }
}
