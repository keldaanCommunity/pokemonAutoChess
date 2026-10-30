import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class UTurnStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const shield = [15, 30, 50, 100][pokemon.stars - 1] ?? 100
    pokemon.moveTo(target.positionX, target.positionY, board, true)
    pokemon.addShield(shield, pokemon, 1, crit)
    target.status.triggerCharm(1000, target, pokemon, false)
  }
}
