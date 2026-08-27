import { AbilityConfigs } from "../../config/game/abilities"
import { Ability } from "../../types/enum/Ability"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class MagicBounceStrategy extends AbilityStrategy {
  requiresTarget = false
  readonly config = AbilityConfigs[Ability.MAGIC_BOUNCE]

  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const { duration } = this.computeConfigWithScaling(pokemon)
    pokemon.status.triggerMagicBounce(duration * 1000)
    pokemon.status.triggerSilence(duration * 1000, pokemon, pokemon)
  }
}
