import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ChainCrazedStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    // Self inflict poison and gain [10,15,20,25] speed, [5,10,15,20,SP] attack and [3,6,10,15,SP] defense
    pokemon.status.triggerPoison(3000, pokemon, pokemon)
    const speedBuff = [10, 15, 20, 25][pokemon.stars - 1] ?? 25
    const attackBuff = [5, 10, 15, 20][pokemon.stars - 1] ?? 20
    const defenseBuff = [3, 6, 10, 15][pokemon.stars - 1] ?? 15
    pokemon.addSpeed(speedBuff, pokemon, 0, false)
    pokemon.addAttack(attackBuff, pokemon, 1, crit)
    pokemon.addDefense(defenseBuff, pokemon, 1, crit)
  }
}
