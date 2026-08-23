import { AttackType } from "../../types/enum/Game"
import { distanceC } from "../../utils/distance"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class CityShuttleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const damage = [10, 20, 40, 80][pokemon.stars - 1] ?? 80
    const shield = [20, 40, 80, 160][pokemon.stars - 1] ?? 160

    // Step 1: Find the closest ally to carry as a passenger (excluding Gogoat itself)
    const passenger = board.getClosestAlly(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.team,
      pokemon.id
    )

    // Store the passenger's ATK to add to damage calculation
    const carriedAllyAttack = passenger ? passenger.atk : 0

    // Step 2: If a passenger exists, move Gogoat adjacent to them first (to saddle them)
    if (passenger) {
      const availablePlaceNearAlly = board.getClosestAvailablePlace(
        passenger.positionX,
        passenger.positionY
      )

      if (availablePlaceNearAlly) {
        pokemon.moveTo(
          availablePlaceNearAlly.x,
          availablePlaceNearAlly.y,
          board,
          false
        )
      }
    }

    // Step 3: Schedule the dash to the farthest enemy position with damage phase
    pokemon.commands.push(
      new DelayedCommand(() => {
        const farthestCoordinate =
          board.getFarthestTargetCoordinateAvailablePlace(pokemon)

        if (farthestCoordinate) {
          // Get all cells in the path from current position to destination
          const cells = board.getCellsBetween(
            pokemon.positionX,
            pokemon.positionY,
            farthestCoordinate.x,
            farthestCoordinate.y
          )

          // Store the starting position before movement to calculate distance traveled
          const startX = pokemon.positionX
          const startY = pokemon.positionY

          const totalDistance = distanceC(
            pokemon.positionX,
            pokemon.positionY,
            farthestCoordinate.x,
            farthestCoordinate.y
          )

          // Step 4: Move Gogoat to the farthest position while carrying the passenger
          pokemon.moveTo(
            farthestCoordinate.x,
            farthestCoordinate.y,
            board,
            false
          )

          // Step 5: Drop the passenger at the closest available space near the destination
          if (passenger) {
            const closestAvailablePlace = board.getClosestAvailablePlace(
              farthestCoordinate.x,
              farthestCoordinate.y
            )
            if (closestAvailablePlace) {
              passenger.moveTo(
                closestAvailablePlace.x,
                closestAvailablePlace.y,
                board,
                false
              )
            }
          }

          // Step 6: Deal damage to all enemies in the path
          // Damage = base damage + 100% of passenger's ATK

          for (const cell of cells) {
            const totalDamage = damage + carriedAllyAttack
            const distance = distanceC(startX, startY, cell.x, cell.y)

            pokemon.commands.push(
              new DelayedCommand(
                () => {
                  pokemon.broadcastAbility({
                    positionX: cell.x,
                    positionY: cell.y
                  })
                  // Only damage enemy team Pokemon
                  cell.value?.team === target.team &&
                    cell.value.handleSpecialDamage(
                      totalDamage,
                      board,
                      AttackType.SPECIAL,
                      pokemon,
                      crit
                    )
                },
                (distance / totalDistance) * 300
              )
            )
          }
        }

        // Step 7: Grant shields to both Gogoat and the passenger
        pokemon.addShield(shield, pokemon, 1, crit)
        passenger?.addShield(shield, pokemon, 1, crit)
      }, 300)
    )
  }
}
