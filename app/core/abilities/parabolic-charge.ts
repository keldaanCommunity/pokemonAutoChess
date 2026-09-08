import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ParabolicChargeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const heal = [25, 50, 75, 100][pokemon.stars - 1] ?? 100
    const overHeal = Math.max(0, heal + pokemon.hp - pokemon.maxHP)
    pokemon.handleHeal(heal, pokemon, 0, false)
    target.handleSpecialDamage(
      ([25, 50, 100, 200][pokemon.stars - 1] ?? 200) + overHeal,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
  }
}
