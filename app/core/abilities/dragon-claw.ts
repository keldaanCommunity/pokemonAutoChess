import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class DragonClawStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    // Deal 30/60/120/240 special damage to the lowest health adjacent enemy and Wound them for 4 seconds.
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 120, 240][pokemon.stars - 1] ?? 240
    const cells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      false
    )
    let lowestHp = 9999
    let lowestHpTarget: PokemonEntity | undefined
    for (const cell of cells) {
      if (cell.value && cell.value.team !== pokemon.team) {
        if (cell.value.maxHP < lowestHp) {
          lowestHp = cell.value.maxHP
          lowestHpTarget = cell.value
        }
      }
    }
    if (!lowestHpTarget) {
      lowestHpTarget = target
    }
    lowestHpTarget.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    lowestHpTarget.status.triggerWound(4000, lowestHpTarget, pokemon)
    pokemon.setTarget(lowestHpTarget)
  }
}
