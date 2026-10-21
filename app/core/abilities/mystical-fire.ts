import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class MysticalFireStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 40, 80, 160][pokemon.stars - 1] ?? 160
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.addAbilityPower(-([15, 20, 25, 50][pokemon.stars - 1] ?? 50), pokemon, 1, crit)
  }
}
