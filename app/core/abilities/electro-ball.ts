import { AttackType } from "../../types/enum/Game"
import { distanceM } from "../../utils/distance"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class ElectroBallStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    let projectileSpeedRemaining = pokemon.speed
    const delay = Math.round(200 * (50 / pokemon.speed))
    const targetsHit = new Set<PokemonEntity>()
    const bounce = (
      currentTarget: PokemonEntity,
      prevTarget: PokemonEntity
    ) => {
      const distance = distanceM(
        prevTarget.positionX,
        prevTarget.positionY,
        currentTarget.positionX,
        currentTarget.positionY
      )
      pokemon.broadcastAbility({
        positionX: prevTarget.positionX,
        positionY: prevTarget.positionY,
        targetX: currentTarget.positionX,
        targetY: currentTarget.positionY,
        delay: delay * distance
      })

      const damage = [10, 20, 40, 80][pokemon.stars - 1] ?? 80
      currentTarget.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )

      targetsHit.add(currentTarget)
      const possibleTargets = board.cells.filter<PokemonEntity>(
        (cell): cell is PokemonEntity =>
          cell !== undefined &&
          cell.team !== pokemon.team &&
          !targetsHit.has(cell)
      )
      if (possibleTargets.length === 0) return
      const distances = possibleTargets.map((cell) =>
        distanceM(
          cell.positionX,
          cell.positionY,
          currentTarget.positionX,
          currentTarget.positionY
        )
      )
      const minDistance = Math.min(...distances)
      const closestTarget = possibleTargets[distances.indexOf(minDistance)]

      if (closestTarget && projectileSpeedRemaining > 0) {
        const nextTarget = possibleTargets[0]
        projectileSpeedRemaining -= 30
        pokemon.commands.push(
          new DelayedCommand(
            () => bounce(nextTarget, currentTarget),
            delay * minDistance
          )
        )
      }
    }

    bounce(target, pokemon)
  }
}
