import { AbilityConfigs } from "../../config/game/abilities"
import { Ability } from "../../types/enum/Ability"
import { Team } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SingStrategy extends AbilityStrategy {
  readonly config = AbilityConfigs[Ability.SING]

  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const { sleepDuration, targetCount } =
      this.computeConfigWithScaling(pokemon)
    const timer = Math.round(
      sleepDuration * 1000 * (crit ? pokemon.critPower : 1)
    )
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
    for (let i = 0; i < targetCount; i++) {
      const tg = rank[i]
      if (tg) {
        tg.status.triggerSleep(timer, tg)
      }
    }
  }
}
