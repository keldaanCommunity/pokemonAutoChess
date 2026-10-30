import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class BitterBladeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [50, 60, 70, 140][pokemon.stars - 1] ?? 140
    const adjacentCells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      false
    )
    let nbEnemiesHit = 0
    for (const cell of adjacentCells) {
      if (cell.value && cell.value.team !== pokemon.team) {
        nbEnemiesHit++
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    }
    pokemon.handleHeal(pokemon.maxHP * 0.1 * nbEnemiesHit, pokemon, 0, false)
  }
}
