import { AttackType } from "../../types/enum/Game"
import { Synergy } from "../../types/enum/Synergy"
import { min } from "../../utils/number"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SheerColdStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let executeChance =
      ([0.1, 0.2, 0.3, 0.6][pokemon.stars - 1] ?? 0.6) *
      (1 + min(0)((pokemon.hp - target.hp) / target.hp))
    if (target.hasSynergy(Synergy.ICE)) executeChance = 0
    else if (target.status.freeze) executeChance = 1

    let damage = [50, 100, 200, 400][pokemon.stars - 1] ?? 400
    if (chance(executeChance, pokemon)) damage = 9999
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}
