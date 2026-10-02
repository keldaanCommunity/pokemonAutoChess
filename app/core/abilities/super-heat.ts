import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class SuperHeatStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Constant damage per hit
    const damage = [4, 7, 10, 20][pokemon.stars - 1] ?? 20
    // Duration of armor reduction effect in milliseconds
    const duration = 1000
    // Perform the ability 9 times
    for (let i = 0; i < 9; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          if (
            pokemon.status.resurrecting ||
            pokemon.status.freeze ||
            pokemon.status.sleep
          ) {
            return
          }
          // Broadcast the ability animation
          pokemon.broadcastAbility({
            positionX: pokemon.positionX,
            positionY: pokemon.positionY,
            targetX: target.positionX,
            targetY: target.positionY
          })
          // Get enemies in a cone in front of the pokemon
          const coneCells = board
            .getCellsInFront(pokemon, target, 2)
            .filter((cell) => cell.value && cell.value.team !== pokemon.team)
            .map((cell) => cell.value)

          // Apply effects to each enemy in the cone
          for (const enemy of coneCells) {
            if (enemy) {
              // Deal special damage
              enemy.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
              // Reduce enemy's armor
              enemy.status.triggerArmorReduction(duration, enemy)
            }
          }
          // Delay each iteration by 333ms
        }, 333 * i)
      )
    }
  }
}
