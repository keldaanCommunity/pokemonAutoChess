import { AttackType } from "../../types/enum/Game"
import { distanceM } from "../../utils/distance"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class AcrobaticsStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 40, 80, 160][pokemon.stars - 1] ?? 160
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    const travelDistance = 4 - pokemon.items.size
    const candidateDestinationCells = board
      .getCellsInRadius(pokemon.targetX, pokemon.targetY, pokemon.range, false)
      .filter((cell) => cell.value === undefined)
      .sort(
        (a, b) =>
          Math.abs(
            travelDistance -
              distanceM(a.x, a.y, pokemon.positionX, pokemon.positionY)
          ) -
          Math.abs(
            travelDistance -
              distanceM(b.x, b.y, pokemon.positionX, pokemon.positionY)
          )
      )
    if (candidateDestinationCells.length > 0) {
      const destination = candidateDestinationCells[0]
      pokemon.moveTo(destination.x, destination.y, board, false)
    }
  }
}
