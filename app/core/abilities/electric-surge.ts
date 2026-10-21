import { Synergy } from "../../types/enum/Synergy"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ElectricSurgeStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const buff = [10,10,10,20][pokemon.stars - 1] ?? 20
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (
        ally &&
        ally.id !== pokemon.id &&
        pokemon.team === ally.team &&
        ally.types.has(Synergy.ELECTRIC)
      ) {
        ally.addSpeed(buff, pokemon, 1, crit)
      }
    })
  }
}
