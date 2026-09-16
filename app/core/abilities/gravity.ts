import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class GravityStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const lockDuration = Math.round(
       ([2000, 2000, 2000, 5000][pokemon.stars - 1] ?? 5000) * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
     )
    board.forEach((x, y, unitOnCell) => {
      if (unitOnCell && unitOnCell.team !== pokemon.team) {
        unitOnCell.status.triggerLocked(lockDuration, unitOnCell)
      }
    })
  }
}
