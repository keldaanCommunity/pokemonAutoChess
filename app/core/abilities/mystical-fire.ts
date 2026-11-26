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
    const damage = [20, 40, 80, 150, 300][pokemon.stars - 1] ?? 300
    const apDebuff = [15, 20, 25, 50, 100][pokemon.stars - 1] ?? 100
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.addAbilityPower(-apDebuff, pokemon, 1, crit)
  }
}
