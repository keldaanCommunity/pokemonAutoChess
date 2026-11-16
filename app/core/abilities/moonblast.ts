import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class MoonblastStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const damage = [10, 14, 18, 26][pokemon.stars - 1] ?? 26
    let currentTarget: PokemonEntity | undefined = target
    let moonsRemaining = 6
    let moonIndex = 0

    function sendMoon() {
      if (!currentTarget) return
      pokemon.broadcastAbility({
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: currentTarget.positionX,
        targetY: currentTarget.positionY
      })

      moonIndex++

      const { death } = currentTarget.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )

      moonsRemaining--

      // If target died, find closest enemy and gain bonus moon
      if (death) {
        const closestEnemy = board.getClosestEnemy(
          currentTarget.positionX,
          currentTarget.positionY,
          currentTarget.team
        )
        if (closestEnemy) {
          currentTarget = closestEnemy
          moonsRemaining++ // Gain 1 additional moon when switching targets
        } else {
          currentTarget = undefined
        }
      }

      if (
        moonsRemaining > 0 &&
        currentTarget &&
        currentTarget.hp > 0 &&
        moonIndex < 20
      ) {
        // safety check to prevent infinite loops
        pokemon.commands.push(
          new DelayedCommand(() => {
            sendMoon()
          }, 200)
        )
      }
    }
    sendMoon()
  }
}
