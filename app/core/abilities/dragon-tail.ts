import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class DragonTailStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 100, 150][pokemon.stars - 1] ?? 150
    const defenseBuff = [2, 4, 6, 10][pokemon.stars - 1] ?? 10
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.addDefense(defenseBuff, pokemon, 1, crit)
    pokemon.addSpecialDefense(defenseBuff, pokemon, 1, crit)
  }
}
