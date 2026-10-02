import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class TopsyTurvyStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [40, 80, 160, 320][pokemon.stars - 1] ?? 320
    pokemon.commands.push(
      new DelayedCommand(() => {
        target.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        if (target.atk !== target.baseAtk) {
          const d = target.atk - target.baseAtk
          target.addAttack(-2 * d, pokemon, 0, false)
        }
        if (target.ap !== 0) {
          target.addAbilityPower(-2 * target.ap, pokemon, 0, false)
        }
        if (target.def !== target.baseDef) {
          const d = target.def - target.baseDef
          target.addDefense(-2 * d, pokemon, 0, false)
        }
        if (target.speDef !== target.baseSpeDef) {
          const d = target.speDef - target.baseSpeDef
          target.addSpecialDefense(-2 * d, pokemon, 0, false)
        }
      }, 500)
    )
  }
}
