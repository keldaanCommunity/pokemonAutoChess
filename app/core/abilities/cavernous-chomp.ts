import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class CavernousChompStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Deals 40/80/160/320 damage to the target.
    // If the user is able to KO the target with its ability, it becomes Enraged for 1/2/3 seconds.
    const damage = [40, 80, 160, 320][pokemon.stars - 1] ?? 320
    const { death } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    if (death) {
      const enragedDuration = [1000, 2000, 3000][pokemon.stars - 1] ?? 3000
      pokemon.status.triggerRage(enragedDuration, pokemon)
    }
  }
}
