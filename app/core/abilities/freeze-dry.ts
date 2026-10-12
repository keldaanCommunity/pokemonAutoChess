import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class FreezeDryStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.commands.push(
      new DelayedCommand(() => {
        if (target && target.hp > 0) {
          const damage =
            ([30, 50, 70, 140][pokemon.stars - 1] ?? 140) *
              (1 + pokemon.ap / 100) +
            pokemon.speDef
          const killDamage =
            ([10, 20, 30, 60][pokemon.stars - 1] ?? 60) *
              (1 + pokemon.ap / 100) +
            pokemon.speDef * 0.5
          const x = target.positionX
          const y = target.positionY
          const attackResult = target.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit,
            false // ap boost already computed
          )
          if (attackResult.death) {
            const cells = board.getAdjacentCells(x, y, false)
            cells.forEach((cell) => {
              if (cell.value && cell.value.team !== pokemon.team) {
                pokemon.broadcastAbility({
                  positionX: x,
                  positionY: y,
                  targetX: cell.x,
                  targetY: cell.y
                })
                cell.value.handleSpecialDamage(
                  killDamage,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit,
                  false // ap boost already computed
                )
              }
            })
          }
        }
      }, 250)
    )
  }
}
