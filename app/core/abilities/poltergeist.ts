import { AttackType } from "../../types/enum/Game"
import { Tools } from "../../types/enum/Item"
import { isIn } from "../../utils/array"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class PoltergeistStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage = [30, 60, 120, 240][pokemon.stars - 1] ?? 240
    target.items.forEach((item) => (damage += isIn(Tools, item) ? 40 : 20))
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}
