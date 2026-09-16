import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class MetalBurstStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const base = [10, 20, 30, 50][pokemon.stars - 1] ?? 50
    const damage = Math.floor(base + 3 * pokemon.count.fightingBlockCount)
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
  }
}
