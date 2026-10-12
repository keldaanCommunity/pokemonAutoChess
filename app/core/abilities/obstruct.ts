import { EffectEnum } from "../../types/enum/Effect"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class ObstructStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const flatDuration = [500, 750, 1000, 2000][pokemon.stars - 1] ?? 2000
    const durationWithAP = flatDuration * (2 + pokemon.ap / 100)
    const critScalingFactor = 0.5
    const duration = Math.round(
      durationWithAP *
        (crit ? 1 + (pokemon.critPower - 1) * critScalingFactor : 1)
    )
    pokemon.status.triggerProtect(duration)
    pokemon.effects.add(EffectEnum.OBSTRUCT)
    pokemon.commands.push(
      new DelayedCommand(
        () => pokemon.effects.delete(EffectEnum.OBSTRUCT),
        duration
      )
    )
  }
}
