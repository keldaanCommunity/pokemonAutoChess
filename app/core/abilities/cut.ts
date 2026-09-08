import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class CutStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    //Deal [20,30,40,80,SP]% of target max HP as special damage. Inflicts WOUND for 5 seconds
    const damageFactor = [0.2, 0.3, 0.4, 0.8][pokemon.stars - 1] ?? 0.8
    const damage = damageFactor * target.maxHP
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerWound(5000, target, pokemon)
  }
}
