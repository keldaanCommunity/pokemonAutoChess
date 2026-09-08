import { Weather } from "../../types/enum/Weather"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ShoreUpStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    let healFactor = [0.2, 0.25, 0.4, 0.8][pokemon.stars - 1] ?? 0.8
    if (pokemon.simulation.weather === Weather.SANDSTORM) {
      healFactor += 0.1
    }
    pokemon.handleHeal(healFactor * pokemon.maxHP, pokemon, 1, crit)
  }
}
