import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class DragonEnergyStrategy extends AbilityStrategy {
  requiresTarget = false

  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity | null,
    crit: boolean
  ) {
    const closestTarget = pokemon.state.getNearestTargetAtSight(
      pokemon,
      board
    )?.target
    if (!closestTarget) return

    super.process(pokemon, board, closestTarget, crit)
    const damageMultiplier = [1, 1, 1, 1.5][pokemon.stars - 1] ?? 1.5
    closestTarget.handleSpecialDamage(
      pokemon.hp * damageMultiplier,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
  }
}
