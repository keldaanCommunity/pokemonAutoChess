import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SwaggerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    //Confuses and enrage the target for 2 seconds
    const baseDuration = [1500, 2000, 3000, 5000][pokemon.stars - 1] ?? 5000
    const duration = Math.round(
      baseDuration * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
    )
    target.status.triggerConfusion(duration, target, pokemon)
    target.status.triggerRage(duration, target)
  }
}
