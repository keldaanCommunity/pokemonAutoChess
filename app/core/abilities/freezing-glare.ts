import { AbilityConfigs } from "../../config/game/abilities"
import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import { effectInLine } from "../board"

import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class FreezingGlareStrategy extends AbilityStrategy {
  readonly config = AbilityConfigs[Ability.FREEZING_GLARE]

  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const { damage, freezeChance, freezeDuration } =
      this.computeConfigWithScaling(pokemon)
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit,
          false
        )
        if (chance(freezeChance / 100)) {
          cell.value.status.triggerFreeze(
            freezeDuration * 1000,
            cell.value,
            pokemon
          )
        }
      }
    })
  }
}
