import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class DragonEnergyStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damageMultiplier = [1,1,1,1.5][pokemon.stars - 1] ?? 1.5
    target.handleSpecialDamage(
      pokemon.hp * damageMultiplier,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
  }
}
