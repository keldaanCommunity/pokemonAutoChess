import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class FlyStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const destination = board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    if (destination) {
      pokemon.status.triggerProtect(2000)
      pokemon.broadcastAbility({
        skill: "FLYING_TAKEOFF",
        targetX: destination.target.positionX,
        targetY: destination.target.positionY
      })
      pokemon.skydiveTo(destination.x, destination.y, board)
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.broadcastAbility({
            skill: "FLYING_SKYDIVE",
            positionX: destination.x,
            positionY: destination.y,
            targetX: destination.target.positionX,
            targetY: destination.target.positionY
          })
        }, 500)
      )

      pokemon.commands.push(
        new DelayedCommand(() => {
          if (destination.target && destination.target.hp > 0) {
            const damageMultiplier = [4,4,4,8][pokemon.stars - 1] ?? 8
            const damage = damageMultiplier * pokemon.atk
            destination.target.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        }, 1000)
      )
    }
  }
}
