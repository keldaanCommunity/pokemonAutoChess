import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class FellStingerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damageMultiplier = [4,4,4,8][pokemon.stars - 1] ?? 9
    const damage = damageMultiplier * pokemon.baseAtk
    const { death } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    if (death && !pokemon.isSpawn) {
      pokemon.addAttack(0.3 * pokemon.baseAtk, pokemon, 0, false)
    }
  }
}
