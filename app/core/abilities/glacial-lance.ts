import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import { getMoveSpeed } from "../move-speed"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class GlacialLanceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const corner = board.getTeleportationCell(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.team
    )
    if (corner) {
      pokemon.moveTo(corner.x, corner.y, board, false)
    }
    pokemon.commands.push(
      new DelayedCommand(
        () => {
          const damage = ([3, 3, 3, 6][pokemon.stars - 1] ?? 6) * pokemon.atk
          const farthestTarget =
            pokemon.state.getFarthestTarget(pokemon, board) ?? target
          let targetHit: PokemonEntity = farthestTarget

          const cells = board.getCellsBetween(
            pokemon.positionX,
            pokemon.positionY,
            farthestTarget.positionX,
            farthestTarget.positionY
          )
          for (const cell of cells) {
            if (cell.value && cell.value.team != pokemon.team) {
              targetHit = cell.value
              break
            }
          }

          pokemon.broadcastAbility({
            targetX: targetHit.positionX,
            targetY: targetHit.positionY
          })

          pokemon.commands.push(
            new DelayedCommand(() => {
              targetHit.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )

              board
                .getAdjacentCells(targetHit.positionX, targetHit.positionY)
                .forEach((cell) => {
                  if (cell.value && cell.value.team !== pokemon.team) {
                    cell.value.handleSpecialDamage(
                      damage * 0.5,
                      board,
                      AttackType.SPECIAL,
                      pokemon,
                      crit
                    )
                  }
                })
            }, 500)
          )
        },
        corner ? Math.round(500 / getMoveSpeed(pokemon)) : 0
      )
    )
  }
}
