import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class LickStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    target.status.triggerConfusion(3000, target, pokemon)
    target.status.triggerParalysis(3000, target, pokemon)
    const damage = [30, 60, 120, 240][pokemon.stars - 1] ?? 240
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
