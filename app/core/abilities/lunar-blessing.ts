import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class LunarBlessingStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (ally && pokemon.team == ally.team && ally.hp < ally.maxHP) {
        ally.handleHeal(([25, 25, 25, 50][pokemon.stars - 1] ?? 50) / 100 * ally.maxHP, pokemon, 1, crit)
        ally.status.clearNegativeStatus(ally, pokemon)
      }
    })
  }
}
