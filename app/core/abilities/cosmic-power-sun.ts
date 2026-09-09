import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class CosmicPowerSunStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const atkBuffMultiplier = [0.25, 0.25, 0.25, 0.5][pokemon.stars - 1] ?? 0.5
    board.forEach((x, y, ally) => {
      if (ally && ally.id !== pokemon.id && ally.team === pokemon.team) {
        ally.addAttack(atkBuffMultiplier * ally.baseAtk, pokemon, 1, crit)
      }
    })
  }
}
