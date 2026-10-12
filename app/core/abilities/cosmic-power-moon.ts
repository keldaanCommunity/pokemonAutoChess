import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class CosmicPowerMoonStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const apGain = [25,25,25,50][pokemon.stars - 1] ?? 50
    board.forEach((x, y, ally) => {
      if (ally && ally.id !== pokemon.id && ally.team === pokemon.team) {
        ally.addAbilityPower(apGain, pokemon, 1, crit)
      }
    })
  }
}
