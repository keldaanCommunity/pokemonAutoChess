import { AttackType } from "../../types/enum/Game"
import { distanceC } from "../../utils/distance"
import { average, min } from "../../utils/number"
import { pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class HydroVortexStrategy extends AbilityStrategy {
  requiresTarget = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity | null,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [15, 30, 60, 100, 200][pokemon.stars - 1] ?? 200
    const damageReductionOverDistance = 0.3

    const enemies = board.cells.filter<PokemonEntity>(
      (v): v is PokemonEntity => v != null && v.team !== pokemon.team
    )
    const center = {
      x: Math.round(average(...enemies.map((e) => e.positionX))),
      y: Math.round(average(...enemies.map((e) => e.positionY)))
    }

    pokemon.broadcastAbility({ targetX: center.x, targetY: center.y })

    const mappingAttractCell = [
      {
        to: [center.x, center.y],
        from: [
          [center.x - 1, center.y - 1],
          [center.x, center.y - 1],
          [center.x + 1, center.y - 1],
          [center.x - 1, center.y],
          [center.x + 1, center.y],
          [center.x - 1, center.y + 1],
          [center.x, center.y + 1],
          [center.x + 1, center.y + 1]
        ]
      },
      {
        to: [center.x - 1, center.y],
        from: [[center.x - 2, center.y]]
      },
      {
        to: [center.x + 1, center.y],
        from: [[center.x + 2, center.y]]
      },
      {
        to: [center.x, center.y - 1],
        from: [[center.x, center.y - 2]]
      },
      {
        to: [center.x, center.y + 1],
        from: [[center.x, center.y + 2]]
      },
      {
        to: [center.x - 1, center.y - 1],
        from: [
          [center.x - 2, center.y - 1],
          [center.x - 2, center.y - 2],
          [center.x - 1, center.y - 2]
        ]
      },
      {
        to: [center.x + 1, center.y - 1],
        from: [
          [center.x + 2, center.y - 1],
          [center.x + 2, center.y - 2],
          [center.x + 1, center.y - 2]
        ]
      },
      {
        to: [center.x - 1, center.y + 1],
        from: [
          [center.x - 2, center.y + 1],
          [center.x - 2, center.y + 2],
          [center.x - 1, center.y + 2]
        ]
      },
      {
        to: [center.x + 1, center.y + 1],
        from: [
          [center.x + 2, center.y + 1],
          [center.x + 2, center.y + 2],
          [center.x + 1, center.y + 2]
        ]
      }
    ]

    function tick() {
      // attract enemies
      mappingAttractCell.forEach((cell) => {
        const attractedEnemies = cell.from
          .map(([x, y]) => board.getEntityOnCell(x, y))
          .filter(
            (enemy): enemy is PokemonEntity =>
              enemy != null && enemy.team !== pokemon.team
          )
        const [destX, destY] = cell.to
        if (
          attractedEnemies.length > 0 &&
          board.getEntityOnCell(destX, destY) === undefined
        ) {
          const attractedEnemy = pickRandomIn(attractedEnemies)
          attractedEnemy.moveTo(destX, destY, board, true)
        }
      })

      board
        .getCellsInRadius(center.x, center.y, 2, true)
        .map((cell) => cell.value)
        .filter((e): e is PokemonEntity => e != null && e.team !== pokemon.team)
        .forEach((enemy) => {
          const distance = distanceC(
            enemy.positionX,
            enemy.positionY,
            center.x,
            center.y
          )
          const damageWithDistanceReduction = min(1)(
            damage * (1 - distance * damageReductionOverDistance)
          )
          enemy.handleSpecialDamage(
            damageWithDistanceReduction,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        })
    }

    for (let i = 0; i < 6; i++) {
      pokemon.simulation.commands.push(
        new DelayedCommand(() => {
          tick()
        }, 500 * i)
      )
    }
  }
}
