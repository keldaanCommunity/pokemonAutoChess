import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class NightShadeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const flatDamagePercent =
      [0.125, 0.165, 0.25, 0.35][pokemon.stars - 1] ?? 0.35
    const flatDamage = flatDamagePercent * target.maxHP
    const damageWithAP = Math.ceil(flatDamage * (2 + pokemon.ap / 100))
    target.handleSpecialDamage(
      damageWithAP,
      board,
      AttackType.TRUE,
      pokemon,
      crit,
      false
    )
  }
}
