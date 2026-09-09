import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class ScaleShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    pokemon.status.triggerArmorReduction(2000, pokemon)
    const scalePositions = new Array<{ x: number; y: number; delay: number }>()

    const adjacentCells = [
      [pokemon.positionX, pokemon.positionY - 1],
      [pokemon.positionX, pokemon.positionY + 1],
      [pokemon.positionX - 1, pokemon.positionY],
      [pokemon.positionX + 1, pokemon.positionY],
      [pokemon.positionX - 1, pokemon.positionY - 1],
      [pokemon.positionX + 1, pokemon.positionY - 1],
      [pokemon.positionX - 1, pokemon.positionY + 1],
      [pokemon.positionX + 1, pokemon.positionY + 1]
    ]

    let inc = 0
    for (const cell of adjacentCells) {
      const [x, y] = cell
      const delay = 2000 + inc
      scalePositions.push({
        x,
        y,
        delay
      })
      inc += 100
      pokemon.broadcastAbility({
        skill: "SCALE_SHOT_CHARGE",
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: x,
        targetY: y,
        delay: delay
      })
      const entityOnCell = board.getEntityOnCell(x, y)
      if (entityOnCell && entityOnCell.team !== pokemon.team) {
        entityOnCell.status.triggerArmorReduction(2000, entityOnCell)
        const chargeDamage = [40, 40, 40, 80][pokemon.stars - 1] ?? 80
        entityOnCell.handleSpecialDamage(
          chargeDamage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    }

    for (const { x, y, delay } of scalePositions) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          if (
            pokemon.status.freeze ||
            pokemon.status.sleep ||
            pokemon.status.resurrecting
          )
            return
          const farthestTarget = pokemon.state.getFarthestTarget(pokemon, board)
          if (farthestTarget) {
            pokemon.broadcastAbility({
              positionX: x,
              positionY: y,
              targetX: farthestTarget.positionX,
              targetY: farthestTarget.positionY
            })
            const cellsBetween = board.getCellsBetween(
              x,
              y,
              farthestTarget.positionX,
              farthestTarget.positionY
            )
            for (const cell of cellsBetween) {
              if (cell.value && cell.value.team !== pokemon.team) {
                const mainDmg = [10, 15, 20, 40][pokemon.stars - 1] ?? 40
                const splashDmg = [10, 10, 10, 20][pokemon.stars - 1] ?? 20
                cell.value.handleSpecialDamage(
                  cell.value.id === farthestTarget.id ? mainDmg : splashDmg,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit
                )
              }
            }
          }
        }, delay)
      )
    }
  }
}
