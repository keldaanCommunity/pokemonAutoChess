import { AbilityConfigs } from "../../config/game/abilities"
import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import { effectInLine } from "../board"

import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

const abilityConfig = AbilityConfigs[Ability.FREEZING_GLARE]

export class FreezingGlareStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = this.computeValue(abilityConfig.damage, pokemon)
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        if (chance(abilityConfig.freezeChance / 100, pokemon)) {
          const freezeDuration = this.computeValue(
            abilityConfig.freezeDuration,
            pokemon
          )
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
