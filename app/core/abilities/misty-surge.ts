import { Synergy } from "../../types/enum/Synergy"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class MistySurgeStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const ppGain = [25, 25, 25, 50][pokemon.stars - 1] ?? 50
    const hpGain = [25, 25, 25, 50][pokemon.stars - 1] ?? 50
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (
        ally &&
        ally.id !== pokemon.id &&
        pokemon.team === ally.team &&
        ally.types.has(Synergy.FAIRY)
      ) {
        ally.addPP(ppGain, pokemon, 1, crit)
        ally.handleHeal(hpGain, pokemon, 1, crit)
      }
    })
  }
}
