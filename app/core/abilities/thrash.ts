import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ThrashStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const atkBuff = [100, 100, 120, 150][pokemon.stars - 1] ?? 150
    pokemon.addAttack(Math.floor(atkBuff / 100 * pokemon.baseAtk), pokemon, 1, crit)
    pokemon.status.triggerConfusion(3000, pokemon, pokemon)
  }
}
