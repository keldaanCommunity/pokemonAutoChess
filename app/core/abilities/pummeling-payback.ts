import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class PummelingPaybackStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    // Heal the pokemon by a fixed amount
    const healAmount = [20, 30, 40, 80][pokemon.stars - 1] ?? 80

    // Calculate total damage based on base damage and attack bonus
    const baseDamage = [20, 40, 60, 120][pokemon.stars - 1] ?? 120
    const adBonus = 1.25 * pokemon.atk
    const totalDamage = baseDamage + adBonus

    // Deal special damage to the target
    target.handleSpecialDamage(
      totalDamage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )

    // Apply healing to the pokemon
    pokemon.handleHeal(healAmount, pokemon, 1, crit)
  }
}
