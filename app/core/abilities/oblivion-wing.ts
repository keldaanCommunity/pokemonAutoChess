import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class OblivionWingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const bestLine = board.getBestLine(
      pokemon.positionX,
      pokemon.positionY,
      (cell) =>
        !!cell.value && cell.value.team !== pokemon.team && cell.value.hp > 0,
      (cell) => cell.value === target
    )

    const endpoint = bestLine[bestLine.length - 1]
    if (!endpoint) return
    pokemon.broadcastAbility({
      targetX: endpoint.x,
      targetY: endpoint.y,
      ap: Math.round(pokemon.ap * (crit ? pokemon.critPower : 1))
    })
    const damage = [30, 50, 70, 100][pokemon.stars - 1] ?? 100
    let totalDamage = 0
    for (const cell of bestLine) {
      const enemy = cell.value
      if (enemy && enemy.team !== pokemon.team && enemy.hp > 0) {
        totalDamage += enemy.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        ).takenDamage
      }
    }
    if (totalDamage > 0) {
      pokemon.handleHeal(Math.round(0.5 * totalDamage), pokemon, 0, false)
    }
  }
}
