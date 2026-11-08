import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class MegaDrainStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [10, 20, 40, 80, 150][pokemon.stars - 1] ?? 150
    const adjacentCells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      false
    )
    let totalDamageDealt = 0
    for (const cell of adjacentCells) {
      if (cell.value && cell.value.team !== pokemon.team) {
        const { takenDamage } = cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        totalDamageDealt += takenDamage
      }
    }
    pokemon.handleHeal(Math.ceil(totalDamageDealt * 0.5), pokemon, 0, false)
  }
}
