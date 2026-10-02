import { AttackType } from "../../types/enum/Game"
import { Item } from "../../types/enum/Item"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ElectroWebStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const steal = [15, 30, 60, 120][pokemon.stars - 1] ?? 120
    const damage = [15, 30, 60, 120][pokemon.stars - 1] ?? 120
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          if (cell.value.items.has(Item.TWIST_BAND) === false) {
            cell.value.addSpeed(-steal, pokemon, 1, crit)
            pokemon.addSpeed(steal, pokemon, 1, crit)
          }
        }
      })
  }
}
