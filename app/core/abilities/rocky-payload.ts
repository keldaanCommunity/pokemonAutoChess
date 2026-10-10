import { EffectEnum } from "../../types/enum/Effect"
import { AttackType } from "../../types/enum/Game"
import { distanceE } from "../../utils/distance"
import type { Board } from "../board"
import { getMoveSpeed } from "../move-speed"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export function rockyPayloadEffect({
  pokemon,
  board,
  crit,
  departure,
  destination
}: {
  pokemon: PokemonEntity
  board: Board
  crit: boolean
  departure: [number, number]
  destination: [number, number]
}) {
  const baseDamage = [10, 20, 30, 60][pokemon.stars - 1] ?? 60
  const defFactor = 1

  if (pokemon.effects.has(EffectEnum.ROCKY_PAYLOAD_COOLDOWN)) return
  pokemon.effects.add(EffectEnum.ROCKY_PAYLOAD_COOLDOWN)
  pokemon.commands.push(
    new DelayedCommand(() => {
      pokemon.effects.delete(EffectEnum.ROCKY_PAYLOAD_COOLDOWN)
    }, 250)
  )

  const cells = board.getCellsBetween(
    departure[0],
    departure[1],
    destination[0],
    destination[1]
  )
  const enemiesInThePath = cells
    .filter((cell) => cell.value && cell.value.team !== pokemon.team)
    .map((cell) => cell.value as PokemonEntity)
  let nearestEnemyInThePath = enemiesInThePath[0]
  if (nearestEnemyInThePath == null) {
    const enemies = board.cells.filter(
      (enemy): enemy is PokemonEntity =>
        enemy != null && enemy.team !== pokemon.team
    )
    const pathCenter = cells[Math.floor(cells.length / 2)] ?? {
      x: destination[0],
      y: destination[1]
    }

    nearestEnemyInThePath = enemies.reduce((a, b) => {
      const distanceA = distanceE(
        a.positionX,
        a.positionY,
        pathCenter.x,
        pathCenter.y
      )
      const distanceB = distanceE(
        b.positionX,
        b.positionY,
        pathCenter.x,
        pathCenter.y
      )
      return distanceA < distanceB ? a : b
    })
  }

  if (nearestEnemyInThePath) {
    const toBombDistance = distanceE(
      departure[0],
      departure[1],
      nearestEnemyInThePath.positionX,
      nearestEnemyInThePath.positionY
    )
    const fromBombDistance = distanceE(
      nearestEnemyInThePath.positionX,
      nearestEnemyInThePath.positionY,
      destination[0],
      destination[1]
    )
    const duration = Math.round(500 / getMoveSpeed(pokemon))
    const bombFallDelay = 300
    const dropDelay = Math.round(
      (duration * toBombDistance) / (toBombDistance + fromBombDistance)
    )
    pokemon.broadcastAbility({
      targetX: nearestEnemyInThePath.positionX,
      targetY: nearestEnemyInThePath.positionY,
      delay: dropDelay + 50
    })
    pokemon.commands.push(
      new DelayedCommand(() => {
        const damage = Math.round(baseDamage + defFactor * pokemon.def)
        nearestEnemyInThePath.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }, bombFallDelay + dropDelay)
    )
  }
}

export class RockyPayloadStrategy extends AbilityStrategy {
  requiresTarget = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const flyAwayCell = pokemon.flyAway(board, false)
    pokemon.effects
    if (flyAwayCell) {
      rockyPayloadEffect({
        pokemon,
        board,
        crit,
        departure: [pokemon.positionX, pokemon.positionY],
        destination: [flyAwayCell.x, flyAwayCell.y]
      })
    }
  }
}
