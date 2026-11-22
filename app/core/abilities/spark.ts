import { AttackType } from "../../types/enum/Game"
import { min } from "../../utils/number"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class SparkStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 90, 180][pokemon.stars - 1] ?? 180
    const enemiesHit = new Set<string>()

    const propagate = (currentTarget: PokemonEntity, nbBounce = 1) => {
      const newTarget = board
        .getAdjacentCells(currentTarget.positionX, currentTarget.positionY)
        .find(
          (cell) =>
            cell.value &&
            cell.value.team === target.team &&
            !enemiesHit.has(cell.value.id)
        )?.value

      if (newTarget) {
        enemiesHit.add(newTarget.id)
        pokemon.commands.push(
          new DelayedCommand(() => {
            pokemon.broadcastAbility({
              targetX: newTarget.positionX,
              targetY: newTarget.positionY,
              positionX: currentTarget.positionX,
              positionY: currentTarget.positionY,
              ap: min(-100)(pokemon.ap - nbBounce * 20)
            })
            const reducedDamage = Math.ceil(damage / Math.pow(2, nbBounce))
            newTarget.handleSpecialDamage(
              reducedDamage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit,
              true
            )
            if (nbBounce < 10) {
              // safety to avoid infinite loops
              propagate(newTarget, nbBounce + 1)
            }
          }, 250)
        )
      }
    }

    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )

    propagate(target)
  }
}
