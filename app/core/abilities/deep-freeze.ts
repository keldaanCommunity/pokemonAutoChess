import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class DeepFreezeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    // Ability constants
    const damage = 10 // Damage per ice bolt
    const armorReduction = -1 // Special defense reduction per hit
    const totalBolts = [5,7,9,20][pokemon.stars - 1] ?? 20 // Total number of ice bolts to fire
    const boltDelay = 333 // Delay between bolts in milliseconds

    // Tracking variables
    let currentTarget: PokemonEntity | undefined = target
    let startingProjectileCoordinates = {
      x: pokemon.positionX,
      y: pokemon.positionY
    }
    let boltsRemaining = totalBolts

    // Recursive function to fire ice bolts that chain between enemies
    const fireBolt = () => {
      // Stop if no target or no bolts remaining
      if (!currentTarget || boltsRemaining <= 0) return

      // Animate ice bolt from current position to target
      pokemon.broadcastAbility({
        positionX: startingProjectileCoordinates.x,
        positionY: startingProjectileCoordinates.y,
        targetX: currentTarget.positionX,
        targetY: currentTarget.positionY
      })

      // Reduce target's special defense permanently
      currentTarget.addSpecialDefense(armorReduction, pokemon, 0, false)

      // Deal ice damage to current target
      const { death } = currentTarget.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )

      // Consume one bolt
      boltsRemaining--

      // If target dies, chain to closest enemy from the death position
      if (death) {
        const oldPositionX = currentTarget.positionX
        const oldPositionY = currentTarget.positionY
        const nextTarget = board.getClosestEnemy(
          currentTarget.positionX,
          currentTarget.positionY,
          currentTarget.team
        )
        if (nextTarget) {
          startingProjectileCoordinates = {
            x: oldPositionX,
            y: oldPositionY
          }
        }
        currentTarget = nextTarget
      }

      // Schedule next bolt if more remain and target exists
      if (boltsRemaining > 0 && currentTarget) {
        pokemon.commands.push(
          new DelayedCommand(() => {
            fireBolt()
          }, boltDelay)
        )
      }
    }

    // Start the ice bolt chain
    fireBolt()
  }
}
