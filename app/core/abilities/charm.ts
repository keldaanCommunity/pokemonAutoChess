import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class CharmStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const attackReduce = [2, 3, 4, 8][pokemon.stars - 1] ?? 8
    target.addAttack(-attackReduce, pokemon, 1, crit)
    target.status.triggerCharm(3000, target, pokemon, false)
  }
}
