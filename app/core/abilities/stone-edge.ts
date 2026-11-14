import { EffectEnum } from "../../types/enum/Effect"
import { min } from "../../utils/number"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class StoneEdgeStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const duration = ([5, 8, 10, 10][pokemon.stars - 1] ?? 10) * 1000
    if (pokemon.effects.has(EffectEnum.STONE_EDGE)) return // ignore if already active

    pokemon.status.triggerSilence(duration, pokemon, pokemon)
    pokemon.effects.add(EffectEnum.STONE_EDGE)
    const critGain = 20 * (1 + pokemon.ap / 100)
    pokemon.addCritChance(critGain, pokemon, 0, false)
    pokemon.range += 2
    pokemon.commands.push(
      new DelayedCommand(() => {
        pokemon.addCritChance(-critGain, pokemon, 0, false)
        pokemon.range = min(pokemon.baseRange)(pokemon.range - 2)
        pokemon.effects.delete(EffectEnum.STONE_EDGE)
      }, duration)
    )
  }
}
