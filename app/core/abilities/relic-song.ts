import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class RelicSongStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    if (pokemon.count.ult % 3 === 0) {
      const flatDuration = [1000, 1000, 1000, 2500][pokemon.stars - 1] ?? 2500
      const durationWithAP = flatDuration * (2 + pokemon.ap / 100)
      const critScalingFactor = 0.5
      const sleepDuration = Math.round(
        durationWithAP *
          (crit ? 1 + (pokemon.critPower - 1) * critScalingFactor : 1)
      )
      board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
        if (tg && pokemon.team != tg.team) {
          tg.status.triggerSleep(sleepDuration, tg)
        }
      })
    } else {
      board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
        if (tg && pokemon.team === tg.team) {
          tg.addShield(
            [10, 10, 10, 25][pokemon.stars - 1] ?? 25,
            pokemon,
            1,
            crit
          )
        }
      })
    }
  }
}
