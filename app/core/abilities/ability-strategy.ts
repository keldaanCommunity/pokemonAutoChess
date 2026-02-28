import { Team } from "../../types/enum/Game"
import { min } from "../../utils/number"
import type { Board } from "../board"
import { PokemonEntity } from "../pokemon-entity"

export class AbilityStrategy {
  copyable = true // if true, can be copied by mimic, metronome, encore...
  doesRequireTarget = true // if false, can be casted from everywhere without having to walk up to a target at range
  canCritByDefault = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity | null,
    crit: boolean,
    preventDefaultAnim?: boolean
  ) {
    pokemon.pp = min(0)(pokemon.pp - pokemon.maxPP)
    pokemon.count.ult += 1

    if (!preventDefaultAnim) {
      pokemon.broadcastAbility({
        targetX: target ? target.positionX : -1,
        targetY: target ? target.positionY : -1,
        ap: Math.round(pokemon.ap * (crit ? pokemon.critPower : 1))
      })
    }

    if (pokemon.team === Team.BLUE_TEAM) {
      pokemon.simulation.blueAbilitiesCast.push(pokemon.skill)
    } else if (pokemon.team === Team.RED_TEAM) {
      pokemon.simulation.redAbilitiesCast.push(pokemon.skill)
    }
  }
}
