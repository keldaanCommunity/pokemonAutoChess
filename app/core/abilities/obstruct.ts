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
    const scalingFactor = 0.5
    const duration = Math.round(
      ([1000, 1500, 2000, 4000][pokemon.stars - 1] ?? 4000) *
        (1 + (pokemon.ap / 100) * scalingFactor) *
        (crit ? 1 + (pokemon.critPower - 1) * scalingFactor : 1)
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
