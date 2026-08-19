import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class HighHorsepowerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Determine base damage based on pokemon's star level
    const damage = [15, 30, 60, 120][pokemon.stars - 1] ?? 120

    // Calculate direction from pokemon to target
    const orientation = board.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      undefined
    )

    // Find potential knockback position for target
    const destination = board.getKnockBackPlace(
      target.positionX,
      target.positionY,
      orientation
    )

    // Move pokemon to knockback position if available
    if (destination) {
      pokemon.moveTo(destination.x, destination.y, board, false)
    }

    pokemon.commands.push(
      new DelayedCommand(() => {
        pokemon.broadcastAbility({
          positionX: pokemon.positionX,
          positionY: pokemon.positionY
        })

        // Identify enemy pokemon adjacent to the pokemon after movement
        const adjacentEnemies = board
          .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
          .filter((cell) => cell.value && cell.value.team !== pokemon.team)

        // Apply damage based on number of adjacent enemies
        if (adjacentEnemies.length === 1) {
          // Double damage if only one adjacent enemy
          adjacentEnemies[0]?.value?.handleSpecialDamage(
            damage * 2,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        } else if (adjacentEnemies.length > 1) {
          // Normal damage to all adjacent enemies if more than one
          for (const cell of adjacentEnemies) {
            cell.value?.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        }
      }, 300)
    )
  }
}
