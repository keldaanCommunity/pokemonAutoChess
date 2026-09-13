import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class RapidSpinStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 50, 100, 200][pokemon.stars - 1] ?? 200
    const buffAmount = Math.round(0.5 * pokemon.atk)

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    pokemon.addDefense(buffAmount, pokemon, 1, crit)
    pokemon.addSpecialDefense(buffAmount, pokemon, 1, crit)
  }
}
