import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import { effectInLine } from "../board"

import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class HydroPumpStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [20, 40, 80, 160][pokemon.stars - 1] ?? 160
    const { positionX, positionY, orientation } = pokemon
    const ap = Math.round(pokemon.ap * (crit ? pokemon.critPower : 1))
    const { finalX, finalY } = effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        pokemon.broadcastAbility({
          skill: "HYDRO_PUMP_SPLASH",
          positionX,
          positionY,
          orientation,
          targetX: cell.x,
          targetY: cell.y
        })
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
    pokemon.broadcastAbility({
      skill: Ability.HYDRO_PUMP,
      positionX,
      positionY,
      orientation,
      targetX: finalX,
      targetY: finalY,
      ap
    })
  }
}
