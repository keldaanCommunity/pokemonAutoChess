import { getAbilityTierValue } from "../../config/game/ability-definitions/define-ability"
import freezingGlareDefinition from "../../config/game/ability-definitions/freezing-glare"
import { AttackType } from "../../types/enum/Game"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import { effectInLine } from "../board"

import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

const { balance } = freezingGlareDefinition

export class FreezingGlareStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = getAbilityTierValue(balance.damage, pokemon.stars)
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        if (chance(balance.freezeChance, pokemon)) {
          const freezeDuration = getAbilityTierValue(
            balance.freezeDurationMs,
            pokemon.stars
          )
          cell.value.status.triggerFreeze(freezeDuration, cell.value, pokemon)
        }
      }
    })
  }
}
