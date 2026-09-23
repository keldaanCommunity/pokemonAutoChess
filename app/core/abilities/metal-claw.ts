import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class MetalClawStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [10, 20, 40, 80][pokemon.stars - 1] ?? 80
    const atkBuff = [2, 4, 6, 12][pokemon.stars - 1] ?? 12
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
    pokemon.addAttack(atkBuff, pokemon, 1, crit)
  }
}
