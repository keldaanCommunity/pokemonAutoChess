import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class DoubleIronBashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damageMultiplier = [1.5, 1.5, 1.5, 3][pokemon.stars - 1] ?? 3
    const damage = Math.round(pokemon.atk * damageMultiplier)
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.PHYSICAL,
      pokemon,
      crit
    )
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.PHYSICAL,
      pokemon,
      crit
    )
    target.status.triggerFlinch(3000, pokemon)
  }
}
