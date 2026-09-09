import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class PresentStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const chance = Math.pow(Math.random(), 1 - pokemon.luck / 100)
    /* 80 damage: 40%
       150 damage: 30%
       300 damage: 20%
       heal 50HP: 10%
    */
    const dmg80 = [20, 40, 80, 160][pokemon.stars - 1] ?? 160
    const dmg150 = [50, 100, 150, 300][pokemon.stars - 1] ?? 300
    const dmg300 = [100, 200, 300, 600][pokemon.stars - 1] ?? 600
    if (chance < 0.1) {
      target.handleHeal(50, pokemon, 0, false)
    } else if (chance < 0.5) {
      target.handleSpecialDamage(dmg80, board, AttackType.SPECIAL, pokemon, crit)
    } else if (chance < 0.8) {
      target.handleSpecialDamage(dmg150, board, AttackType.SPECIAL, pokemon, crit)
    } else {
      target.handleSpecialDamage(dmg300, board, AttackType.SPECIAL, pokemon, crit)
    }
  }
}
