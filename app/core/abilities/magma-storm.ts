import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class MagmaStormStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const targetsHit = new Set<string>()
    const baseDamage = [50, 75, 100, 200][pokemon.stars - 1] ?? 200
    let power = 1

    const propagate = (currentTarget: PokemonEntity, depth = 0) => {
      if (depth >= 20) return // max recursion limit

      targetsHit.add(currentTarget.id)
      pokemon.broadcastAbility({
        skill: Ability.MAGMA_STORM,
        targetX: currentTarget.positionX,
        targetY: currentTarget.positionY,
        ap: Math.round(pokemon.ap * power)
      })
      currentTarget.handleSpecialDamage(
        baseDamage * power,
        board,
        AttackType.SPECIAL,
        pokemon,
        false
      )

      power -= 0.2
      if (power <= 0) return
      pokemon.commands.push(
        new DelayedCommand(() => {
          const board = pokemon.simulation.board
          const nextEnemies = board
            .getAdjacentCells(currentTarget.positionX, currentTarget.positionY)
            .filter(
              (cell) =>
                cell.value &&
                cell.value.team === currentTarget.team &&
                !targetsHit.has(cell.value.id)
            )
          nextEnemies.forEach((enemy) => {
            if (
              enemy &&
              enemy.value &&
              enemy.value.hp > 0 &&
              !pokemon.simulation.finished
            ) {
              propagate(enemy.value, depth + 1)
            }
          })
        }, 250)
      )
    }

    propagate(target)
  }
}
