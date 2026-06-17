import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class OctazookaStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.ceil(pokemon.atk * ([3, 3, 3, 6][pokemon.stars - 1] ?? 6))
    
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    target.status.triggerBlinded(4000, target)
  }
}
