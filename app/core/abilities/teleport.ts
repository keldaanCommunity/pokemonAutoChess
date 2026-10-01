import { EffectEnum } from "../../types/enum/Effect"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import { OnAttackEffect } from "../effects/effect"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class TeleportStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const damage = [15, 30, 60, 120][pokemon.stars - 1]
    const safeCell = board.getFlyAwayCell(pokemon)
    if (safeCell) {
      pokemon.moveTo(safeCell.x, safeCell.y, board, false)
      const nextAttackBoostEffect = new OnAttackEffect(
        ({ pokemon, target }) => {
          target?.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit,
            true
          )
          pokemon.effectsSet.delete(nextAttackBoostEffect)
          pokemon.effects.delete(EffectEnum.TELEPORT_NEXT_ATTACK)
        }
      )
      pokemon.effectsSet.add(nextAttackBoostEffect)
      pokemon.effects.add(EffectEnum.TELEPORT_NEXT_ATTACK)
    }
  }
}
