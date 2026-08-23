import { AttackType } from "../../types/enum/Game"
import { min } from "../../utils/number"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class HornDrillStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damageFactor = [3, 4, 5, 10][pokemon.stars - 1] ?? 10
    let damage = pokemon.atk * damageFactor
    const executeChance =
      0.3 * (1 + min(0)((pokemon.atk - target.atk) / target.atk))
    if (chance(executeChance, pokemon)) {
      damage = 9999
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}
