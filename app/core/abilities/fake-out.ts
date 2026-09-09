import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class FakeOutStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [40, 80, 150, 300][pokemon.stars - 1] ?? 300
    if (pokemon.ap >= 0) target.status.triggerFlinch(3000, target)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.addAbilityPower(-30, pokemon, 0, false)
  }
}
