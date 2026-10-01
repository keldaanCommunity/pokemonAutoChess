import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import { OnAttackEffect } from "../effects/effect"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ShadowPunchStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const lowestHealthEnemy = (
      board.cells.filter(
        (cell) => cell && cell.team !== pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.hp / a.maxHP - b.hp / b.maxHP)[0]
    const damage = [30, 60, 120, 240][pokemon.stars - 1] ?? 240

    if (lowestHealthEnemy) {
      const coord = pokemon.simulation.getClosestFreeCellToPokemonEntity(
        lowestHealthEnemy,
        (lowestHealthEnemy.team + 1) % 2
      )
      if (coord) {
        pokemon.orientation = board.orientation(
          coord.x,
          coord.y,
          pokemon.positionX,
          pokemon.positionY,
          pokemon
        )
        pokemon.moveTo(coord.x, coord.y, board, false)
      }
      const nextAttackBoostEffect = new OnAttackEffect(
        ({ pokemon, target }) => {
          target?.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit,
            true
          )
          pokemon.effectsSet.delete(nextAttackBoostEffect)
        }
      )
      pokemon.effectsSet.add(nextAttackBoostEffect)
    }
  }
}
