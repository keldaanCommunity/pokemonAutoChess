import { chance } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SweetScentStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Enemies in a 3-range radius can no longer dodge attacks, lose [3,SP] SPE_DEF and have [30,LK]% chance to be CHARM for 1 second
    const cells = board.getCellsInRadius(
      pokemon.positionX,
      pokemon.positionY,
      3,
      false
    )
    const spDefLoss = [4, 6, 8, 10][pokemon.stars - 1] ?? 10
    const speedLoss = [10, 12, 15, 20][pokemon.stars - 1] ?? 20
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        if (chance(0.3, pokemon)) {
          cell.value.status.triggerCharm(1000, cell.value, pokemon, false)
        }
        cell.value.addSpecialDefense(-spDefLoss, pokemon, 1, crit)
        cell.value.addSpeed(-speedLoss, pokemon, 1, crit)
        cell.value.addDodgeChance(-cell.value.dodge, pokemon, 0, false)
      }
    })
  }
}
