import { Team } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SingStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const timer = Math.round(
      ([2000, 2000, 2000, 4000][pokemon.stars - 1] ?? 4000) * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
    )
    const count = [1, 2, 3, 5][pokemon.stars - 1] ?? 5
    const rank = new Array<PokemonEntity>()
    board.forEach((x, y, tg) => {
      if (tg && pokemon.team != tg.team) {
        rank.push(tg)
      }
    })
    rank.sort((a, b) => {
      if (a.team === Team.BLUE_TEAM) {
        return a.positionY - b.positionY
      } else {
        return b.positionY - a.positionY
      }
    })
    for (let i = 0; i < count; i++) {
      const tg = rank[i]
      if (tg) {
        tg.status.triggerSleep(timer, tg)
      }
    }
  }
}
