import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class MantisBladesStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [10, 20, 40, 80][pokemon.stars - 1] ?? 80

    for (const damageType of [
      AttackType.PHYSICAL,
      AttackType.SPECIAL,
      AttackType.TRUE
    ]) {
      target.handleSpecialDamage(damage, board, damageType, pokemon, crit, true)
    }
  }
}
