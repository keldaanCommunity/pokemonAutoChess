import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class BiteStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damageMultiplier = [3, 4, 5, 10][pokemon.stars - 1] ?? 10
    const damage = Math.ceil(damageMultiplier * pokemon.atk)
    const healFactor = 0.5
    const { takenDamage } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      false
    )
    pokemon.handleHeal(Math.ceil(healFactor * takenDamage), pokemon, 1, crit)
    if (takenDamage > 0) target.status.triggerFlinch(5000, target, pokemon)
  }
}
