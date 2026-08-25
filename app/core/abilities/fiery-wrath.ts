import { AbilityConfigs } from "../../config/game/abilities"
import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class FieryWrathStrategy extends AbilityStrategy {
  readonly config = AbilityConfigs[Ability.FIERY_WRATH]

  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const { damage, radius, flinchChance, flinchDuration } =
      this.computeConfigWithScaling(pokemon)

    board
      .getCellsInRadius(pokemon.positionX, pokemon.positionY, radius, false)
      .forEach((cell) => {
        const unit = cell.value
        if (unit && pokemon.team !== unit.team) {
          if (chance(flinchChance / 100)) {
            unit.status.triggerFlinch(flinchDuration * 1000, unit, pokemon)
          }
          unit.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit,
            false
          )
        }
      })
  }
}
