import { AttackType } from "../../types/enum/Game"
import { average } from "../../utils/number"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class BlackHoleEclipseStrategy extends AbilityStrategy {
  requiresTarget = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [40, 70, 100, 130, 200][pokemon.stars - 1] ?? 200

    const enemies = board.cells.filter<PokemonEntity>(
      (v): v is PokemonEntity => v != null && v.team !== pokemon.team
    )
    const center = {
      x: Math.round(average(...enemies.map((e) => e.positionX))),
      y: Math.round(average(...enemies.map((e) => e.positionY)))
    }

    pokemon.broadcastAbility({ targetX: center.x, targetY: center.y })

    board
      .getCellsInRadius(center.x, center.y, 2, true)
      .map((cell) => cell.value)
      .filter((e): e is PokemonEntity => e != null && e.team !== pokemon.team)
      .forEach((enemy) => {
        enemy.toMovingState()
        if (enemy.canBeMoved) {
          enemy.cooldown = 1200
          enemy.broadcastAbility({
            skill: "BLACK_HOLE_ECLIPSE_SUCK",
            targetX: center.x,
            targetY: center.y
          })
          enemy.commands.push(
            new DelayedCommand(() => {
              enemy.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
              const { x, y } = board.getSafePlaceAwayFrom(
                center.x,
                center.y
              ) ?? { x: enemy.positionX, y: enemy.positionY }
              enemy.moveTo(x, y, board, true)
            }, 1000)
          )
        }
      })
  }
}
