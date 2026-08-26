import { AbilityConfigs } from "../../config/game/abilities"
import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class BlizzardStrategy extends AbilityStrategy {
  readonly config = AbilityConfigs[Ability.BLIZZARD]

  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const { damage, freezeDuration, radius, frozenTargetBonusPercent } =
      this.computeConfigWithScaling(pokemon)
    board
      .getCellsInRadius(pokemon.positionX, pokemon.positionY, radius, false)
      .forEach((cell) => {
        if (cell.value && pokemon.team != cell.value.team) {
          const enemy = cell.value
          enemy.handleSpecialDamage(
            enemy.status.freeze
              ? Math.round(damage * (1 + frozenTargetBonusPercent / 100))
              : damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit,
            false
          )
          enemy.status.triggerFreeze(freezeDuration * 1000, enemy, pokemon)
        }
      })
  }
}
