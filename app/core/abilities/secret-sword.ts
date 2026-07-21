import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SecretSwordStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [50, 100, 150, 300][pokemon.stars - 1] ?? 300
    const damageType =
      pokemon.count.fightingBlockCount >= 20
        ? AttackType.TRUE
        : AttackType.SPECIAL
    target.handleSpecialDamage(damage, board, damageType, pokemon, crit)
  }
}
