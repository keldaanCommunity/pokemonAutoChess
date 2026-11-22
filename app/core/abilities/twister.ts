import { AttackType } from "../../types/enum/Game"
import { Synergy } from "../../types/enum/Synergy"
import { distanceM } from "../../utils/distance"
import { pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class TwisterStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [25, 50, 100, 200][pokemon.stars - 1] ?? 200
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    const flyRange = [1, 2, 3, 6][pokemon.stars - 1] ?? 6
    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        const freeCells = board
          .getCellsInRadius(cell.x, cell.y, flyRange, false)
          .filter((cell) => board.getEntityOnCell(cell.x, cell.y) === undefined)
        // filter the cells at max distance from cell
        const distances = freeCells.map((cell) =>
          distanceM(cell.x, cell.y, pokemon.positionX, pokemon.positionY)
        )
        const maxDistance = Math.max(...distances)
        const farthestCells = freeCells.filter(
          (cell, i) => distances[i] === maxDistance
        )
        const destination = pickRandomIn(farthestCells)
        if (destination) {
          cell.value.moveTo(destination.x, destination.y, board, true)
        }
      } else if (
        cell.value &&
        pokemon.team === cell.value.team &&
        pokemon.id !== cell.value.id &&
        cell.value.hasSynergyEffect(Synergy.FLYING)
      ) {
        cell.value.flyAway(board)
      }
    })
  }
}
