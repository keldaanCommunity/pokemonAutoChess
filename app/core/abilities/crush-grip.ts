import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class CrushGripStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const base = [15, 25, 50, 100][pokemon.stars - 1] ?? 100
    const scaling = [50, 100, 200, 400][pokemon.stars - 1] ?? 400
    const damage = Math.round(base + (target.hp / target.maxHP) * scaling)
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}
