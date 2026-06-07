import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class RelicSongStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    if (pokemon.count.ult % 3 === 0) {
      const factor = 0.5
    const sleepDuration = Math.round(
         ([2000, 2000, 2000, 5000][pokemon.stars - 1] ?? 5000) *
          (1 + (pokemon.ap / 100) * factor) *
          (crit ? 1 + (pokemon.critPower - 1) * factor : 1)
      )
      board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
        if (tg && pokemon.team != tg.team) {
          tg.status.triggerSleep(sleepDuration, tg)
        }
      })
    } else {
      board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
        if (tg && pokemon.team === tg.team) {
          tg.addShield([10, 10, 10, 25][pokemon.stars - 1] ?? 25, pokemon, 1, crit)
        }
      })
    }
  }
}
