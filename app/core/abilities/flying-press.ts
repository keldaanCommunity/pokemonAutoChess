import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class FlyingPressStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const destination = board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    if (destination) {
      pokemon.skydiveTo(destination.x, destination.y, board)
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.broadcastAbility({
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
            const damageMultiplier = [0.5, 0.5, 0.5, 1][pokemon.stars - 1] ?? 1
            const damage = damageMultiplier * pokemon.maxHP
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
