import { AttackType } from "../../types/enum/Game"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class DarkVoidStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [10,20,30,60][pokemon.stars - 1] ?? 60
    board
      .getCellsInRadius(target.positionX, target.positionY, 4, true)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          const enemy = cell.value
          enemy.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          if (chance(0.8, pokemon)) {
            enemy.status.triggerSleep(2000, enemy)
          }
        }
      })
  }
}
