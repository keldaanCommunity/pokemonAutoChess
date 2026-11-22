import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class TrimmingMowerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const damage = [20, 30, 40, 80][pokemon.stars - 1] ?? 80
    const healAmount = [30, 45, 60, 120][pokemon.stars - 1] ?? 120

    // Identify potential dash locations within a 2-hex radius
    const dashDestinations = board
      .getCellsInRange(pokemon.positionX, pokemon.positionY, 2, false)
      .filter((cell) => !cell.value)

    // Determine optimal dash location based on maximum enemy coverage
    let bestDestination = { x: pokemon.positionX, y: pokemon.positionY }
    let maxEnemiesHit = 0

    for (const cell of dashDestinations) {
      const enemiesHit = board
        .getAdjacentCells(cell.x, cell.y)
        .filter((c) => c.value && c.value.team !== pokemon.team).length

      if (enemiesHit > maxEnemiesHit) {
        maxEnemiesHit = enemiesHit
        bestDestination = { x: cell.x, y: cell.y }
      }
    }

    if (
      pokemon.positionX !== bestDestination.x ||
      pokemon.positionY !== bestDestination.y
    ) {
      // Execute dash movement to optimal location
      pokemon.moveTo(bestDestination.x, bestDestination.y, board, false)
    }

    // Apply self-healing effect
    const healingResult = pokemon.handleHeal(healAmount, pokemon, 1, crit) || {
      overheal: 0
    }

    if (healingResult.overheal) {
      // Convert excess healing to shield
      pokemon.addShield(healingResult.overheal, pokemon, 0, false)
    }

    pokemon.commands.push(
      new DelayedCommand(() => {
        // Initiate ability visual effect
        pokemon.broadcastAbility({
          positionX: pokemon.positionX,
          positionY: pokemon.positionY
        })
        // Identify and damage adjacent enemy targets
        const adjacentEnemies = board
          .getAdjacentCells(pokemon.positionX, pokemon.positionY)
          .filter((c) => c.value && c.value.team !== pokemon.team)
          .map((c) => c.value)

        for (const enemy of adjacentEnemies) {
          enemy?.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      }, 300)
    )
  }
}
