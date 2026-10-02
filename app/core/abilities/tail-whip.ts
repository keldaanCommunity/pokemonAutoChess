import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class TailWhipStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const defLoss = -([20, 30, 40, 50][pokemon.stars - 1] ?? 50) / 100 * target.def
    target.addDefense(defLoss, pokemon, 1, crit)
  }
}
