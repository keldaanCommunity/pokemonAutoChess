import { AttackType, Team } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class FutureSightStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const damage = [20, 30, 50, 80][pokemon.stars - 1] ?? 80
    const count = [3, 4, 5, 6][pokemon.stars - 1] ?? 6
    const enemies = board.getClosestEnemies(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.team === Team.RED_TEAM ? Team.BLUE_TEAM : Team.RED_TEAM
    )

    const targets = enemies.slice(0, count)

    if (targets.length > 0) {
      pokemon.broadcastAbility({
        skill: "FUTURE_SIGHT"
      })
    }

    pokemon.commands.push(
      new DelayedCommand(() => {
        for (const tg of targets) {
          if (tg.hp > 0) {
            pokemon.broadcastAbility({
              targetX: tg.positionX,
              targetY: tg.positionY,
              skill: "FUTURE_SIGHT_HIT"
            })
            tg.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
            board
              .getAdjacentCells(tg.positionX, tg.positionY)
              .forEach((cell) => {
                if (cell.value && cell.value.team !== pokemon.team) {
                  const { takenDamage } = cell.value.handleSpecialDamage(
                    Math.round(damage * 0.2),
                    board,
                    AttackType.SPECIAL,
                    pokemon,
                    crit
                  )
                  if (takenDamage > 0) {
                    pokemon.broadcastAbility({
                      targetX: cell.x,
                      targetY: cell.y,
                      skill: "FUTURE_SIGHT_SPLASH"
                    })
                  }
                }
              })
          }
        }
      }, 2000)
    )
  }
}
