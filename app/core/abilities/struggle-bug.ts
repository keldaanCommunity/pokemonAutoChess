import { AbilityConfigs } from "../../config/game/abilities"
import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

const abilityConfig = AbilityConfigs[Ability.STRUGGLE_BUG]

export class StruggleBugStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.addAbilityPower(
          -abilityConfig.abilityPowerReduction,
          pokemon,
          0,
          false
        )
        cell.value.handleSpecialDamage(
          this.computeValue(abilityConfig.damage, pokemon),
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}
