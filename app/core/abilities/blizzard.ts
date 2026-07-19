import { AbilityConfigs } from "../../config/game/abilities"
import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

const abilityConfig = AbilityConfigs[Ability.BLIZZARD]

export class BlizzardStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = this.computeValue(abilityConfig.damage, pokemon)
    board
      .getCellsInRadius(
        pokemon.positionX,
        pokemon.positionY,
        abilityConfig.radius,
        false
      )
      .forEach((cell) => {
        if (cell.value && pokemon.team != cell.value.team) {
          const enemy = cell.value
          enemy.handleSpecialDamage(
            enemy.status.freeze
              ? Math.round(
                  damage * (1 + abilityConfig.frozenTargetBonusPercent / 100)
                )
              : damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          enemy.status.triggerFreeze(
            abilityConfig.freezeDuration * 1000,
            enemy,
            pokemon
          )
        }
      })
  }
}
