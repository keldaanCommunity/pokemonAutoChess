import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class CrushClawStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const defLoss = [5, 10, 15, 20][pokemon.stars - 1] ?? 20
    const damageFactor = [1, 1, 1, 2][pokemon.stars - 1] ?? 2
    target.addDefense(-defLoss, pokemon, 0, false)
    for (let i = 0; i < 2; i++) {
      target.handleSpecialDamage(
        pokemon.atk * damageFactor,
        board,
        AttackType.PHYSICAL,
        pokemon,
        crit,
        true
      )
    }
  }
}
