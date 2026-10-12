import { AttackType } from "../../types/enum/Game"
import { Synergy } from "../../types/enum/Synergy"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class StaticShockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 50, 70, 100][pokemon.stars - 1] ?? 100
    const heal = [10, 20, 30, 60][pokemon.stars - 1] ?? 60
    const shield = [10, 20, 30, 60][pokemon.stars - 1] ?? 60

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    const adjacentCells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY
    )
    const fairyCount = adjacentCells.filter(
      (cell) => cell.value && cell.value.types.has(Synergy.FAIRY)
    ).length

    if (fairyCount > 0) {
      pokemon.handleHeal(heal * fairyCount, pokemon, 1, crit)
    }

    const electricCount = adjacentCells.filter(
      (cell) => cell.value && cell.value.types.has(Synergy.ELECTRIC)
    ).length

    if (electricCount > 0) {
      pokemon.addShield(shield * electricCount, pokemon, 1, crit)
    }
  }
}
