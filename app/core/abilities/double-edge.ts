import { AttackType } from "../../types/enum/Game"
import { Item } from "../../types/enum/Item"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class DoubleEdgeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const damage = [55, 110, 220, 440][pokemon.stars - 1] ?? 440
    const recoil = [20, 40, 60, 80][pokemon.stars - 1] ?? 80
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.PHYSICAL,
      pokemon,
      crit
    )
    if (pokemon.items.has(Item.PROTECTIVE_PADS) === false) {
      pokemon.handleSpecialDamage(
        recoil,
        board,
        AttackType.PHYSICAL,
        pokemon,
        crit
      )
    }
  }
}
