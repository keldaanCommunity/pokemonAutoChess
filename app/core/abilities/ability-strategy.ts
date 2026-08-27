import type { AbilityConfig } from "../../config/game/abilities"
import {
  type BalanceParameter,
  computeBalance
} from "../../config/game/balance"
import { Team } from "../../types/enum/Game"
import { min } from "../../utils/number"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"

export class AbilityStrategy {
  requiresTarget = true // if false, can be casted from everywhere without having to walk up to a target at range
  canCritByDefault = false

  protected computeValue(
    parameter: BalanceParameter,
    pokemon: PokemonEntity
  ): number {
    return computeBalance(parameter, pokemon)
  }

  protected computeConfigWithScaling<T extends AbilityConfig>(
    this: AbilityStrategy & { readonly config: T },
    pokemon: PokemonEntity
  ): { [K in keyof T]: number } {
    return Object.fromEntries(
      Object.entries(this.config).map(([key, parameter]) => [
        key,
        this.computeValue(parameter, pokemon)
      ])
    ) as { [K in keyof T]: number }
  }

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
