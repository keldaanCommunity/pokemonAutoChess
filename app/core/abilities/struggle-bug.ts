import { getAbilityTierValue } from "../../config/game/ability-definitions/define-ability"
import struggleBugDefinition from "../../config/game/ability-definitions/struggle-bug"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

const { balance } = struggleBugDefinition

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
          -balance.abilityPowerReduction,
          pokemon,
          0,
          false
        )
        cell.value.handleSpecialDamage(
          getAbilityTierValue(balance.damage, pokemon.stars),
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}
