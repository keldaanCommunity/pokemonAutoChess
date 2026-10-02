import { AttackType } from "../../types/enum/Game"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class CrabHammerStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    let damage = [40, 80, 160, 320][pokemon.stars - 1] ?? 320
    crit = chance((pokemon.critChance + 30) / 100, pokemon) // can crit by default with a 30% increased crit chance
    super.process(pokemon, board, target, crit)
    let attackType = AttackType.SPECIAL
    if (target.hp / target.maxHP < 0.3) {
      damage = 9999
      attackType = AttackType.TRUE
    }
    target.handleSpecialDamage(damage, board, attackType, pokemon, crit)
  }
}
