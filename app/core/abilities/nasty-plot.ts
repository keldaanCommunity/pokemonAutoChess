import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class NastyPlotStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const buff = [4, 7, 10, 20][pokemon.stars - 1] ?? 20
    pokemon.addAttack(buff, pokemon, 1, crit)
    pokemon.resetCooldown(250)
  }
}
