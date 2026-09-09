import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class RockSmashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [25, 50, 100, 200][pokemon.stars - 1] ?? 200
    const armorBreakDuration = [3000, 6000, 9000, 18000][pokemon.stars - 1] ?? 18000

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerArmorReduction(armorBreakDuration, target)
  }
}
