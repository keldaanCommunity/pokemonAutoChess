import type { AbilityConfigValue } from "../../config/game/abilities"
import { Team } from "../../types/enum/Game"
import { min } from "../../utils/number"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"

export class AbilityStrategy {
  requiresTarget = true // if false, can be casted from everywhere without having to walk up to a target at range
  canCritByDefault = false

  protected computeValue(
    value: AbilityConfigValue,
    pokemon: PokemonEntity
  ): number {
    if (typeof value === "number") return value

    return value.split(" + ").reduce((total, term) => {
      const tokens = term.slice(1, -1).split(",")
      const tierValues = tokens.map(Number).filter(Number.isFinite)
      let result =
        tierValues[pokemon.stars - 1] ?? tierValues[tierValues.length - 1]!

      const apModifier = tokens.find((token) => token.startsWith("SP"))
      if (apModifier) {
        const factor = Number(apModifier.split("=")[1] ?? 1)
        result *= 1 + (pokemon.ap * factor) / 100
      } else if (tokens.includes("LK")) {
        result = Math.min(
          100,
          Math.pow(result / 100, 1 - pokemon.luck / 100) * 100
        )
      }

      return total + result
    }, 0)
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
