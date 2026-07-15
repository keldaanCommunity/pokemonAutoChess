import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class BulkUpStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    // Increase base Attack and base Defense by [50,50,50,100]%
    const boostPercent = [0.5, 0.5, 0.5, 1][pokemon.stars - 1] ?? 1
    const atkBoost = Math.ceil(boostPercent * pokemon.baseAtk)
    const defBoost = Math.ceil(boostPercent * pokemon.baseDef)
    pokemon.addAttack(atkBoost, pokemon, 1, crit)
    pokemon.addDefense(defBoost, pokemon, 1, crit)
    pokemon.resetCooldown(300)
  }
}
