import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SuperFangStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const fangPercent = [0.2, 0.3, 0.5, 0.7][pokemon.stars - 1] ?? 0.7
    const damage = Math.ceil(
      fangPercent * target.maxHP * (1 + (0.5 * pokemon.ap) / 100)
    )
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.TRUE,
      pokemon,
      crit,
      false
    )
  }
}
