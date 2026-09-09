import { Synergy } from "../../types/enum/Synergy"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SaltCureStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Adjacent allies gain [10,20,40,80] SHIELD and their status afflictions cured. Adjacent WATER, STEEL or GHOST enemies suffer from BURN for 5 seconds.
    const shield = [10, 20, 40, 80][pokemon.stars - 1] ?? 80
    const cells = board.getCellsInRadius(
      pokemon.positionX,
      pokemon.positionY,
      2,
      false
    )
    cells.forEach((cell) => {
      if (cell.value) {
        if (cell.value.team === pokemon.team) {
          cell.value.addShield(shield, pokemon, 1, crit)
          cell.value.status.clearNegativeStatus(cell.value, pokemon)
        } else {
          if (
            cell.value.types.has(Synergy.WATER) ||
            cell.value.types.has(Synergy.STEEL) ||
            cell.value.types.has(Synergy.GHOST)
          ) {
            cell.value.status.triggerBurn(5000, cell.value, pokemon)
          }
        }
      }
    })
  }
}
