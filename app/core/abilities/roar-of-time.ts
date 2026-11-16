import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { getStrongestUnit } from "../unit-score"
import { AbilityStrategy } from "./ability-strategy"

export class RoarOfTimeStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const speedBuff = [10, 15, 20, 40][pokemon.stars - 1] ?? 40
    const candidates = board.cells.filter(
      (cell) => cell && cell.team === pokemon.team && !cell.status.resurrection
    ) as PokemonEntity[]
    const strongest = getStrongestUnit(candidates)
    if (strongest) {
      strongest.status.addResurrection(strongest)
      strongest.addSpeed(speedBuff, pokemon, 1, crit)
    }
  }
}
