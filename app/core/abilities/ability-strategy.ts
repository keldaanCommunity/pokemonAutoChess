import { Team } from "../../types/enum/Game"
import { min } from "../../utils/number"
import type { Board } from "../board"
import { OnAbilityCastEffect } from "../effects/effect"
import { PokemonEntity } from "../pokemon-entity"

export class AbilityStrategy {
  copyable = true // if true, can be copied by mimic, metronome, encore...
  canCritByDefault = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean,
    preventDefaultAnim?: boolean
  ) {
    pokemon.pp = min(0)(pokemon.pp - pokemon.maxPP)
    pokemon.count.ult += 1

    if (!preventDefaultAnim) {
      pokemon.broadcastAbility({
        targetX: target.positionX,
        targetY: target.positionY,
        ap: Math.round(pokemon.ap * (crit ? pokemon.critPower : 1))
      })
    }

    pokemon.getEffects(OnAbilityCastEffect).forEach((effect) => {
      effect.apply(pokemon, board, target, crit)
    })

    if (pokemon.team === Team.BLUE_TEAM) {
      pokemon.simulation.blueAbilitiesCasted.push(pokemon.skill)
    } else if (pokemon.team === Team.RED_TEAM) {
      pokemon.simulation.redAbilitiesCasted.push(pokemon.skill)
    }
  }
}
