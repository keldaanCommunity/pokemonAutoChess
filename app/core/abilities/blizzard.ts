import blizzardDefinition from "../../config/game/ability-definitions/blizzard"
import { getAbilityTierValue } from "../../config/game/ability-definitions/define-ability"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

const { balance } = blizzardDefinition

export class BlizzardStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = getAbilityTierValue(balance.damage, pokemon.stars)
    board
      .getCellsInRadius(
        pokemon.positionX,
        pokemon.positionY,
        balance.radius,
        false
      )
      .forEach((cell) => {
        if (cell.value && pokemon.team != cell.value.team) {
          const enemy = cell.value
          enemy.handleSpecialDamage(
            enemy.status.freeze
              ? Math.round(damage * balance.frozenTargetDamageMultiplier)
              : damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          enemy.status.triggerFreeze(balance.freezeDurationMs, enemy, pokemon)
        }
      })
  }
}
