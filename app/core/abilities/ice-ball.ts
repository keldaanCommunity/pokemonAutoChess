import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class IceBallStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const baseDamage = [10, 20, 30, 60][pokemon.stars - 1] ?? 60
    const multiplier = [0.5, 1, 1.5, 3][pokemon.stars - 1] ?? 3
    const speDefBoost = 10

    pokemon.addSpecialDefense(speDefBoost, pokemon, 0, false)
    target.handleSpecialDamage(
      baseDamage + multiplier * pokemon.speDef,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
  }
}
