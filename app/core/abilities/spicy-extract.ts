import { distanceE } from "../../utils/distance"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SpicyExtractStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    //Make 1/2/3 closest allies RAGE for [2,SP] seconds
    const nbAllies = [1, 2, 3, 6][pokemon.stars - 1] ?? 6
    const rageDuration =
      2000 * (1 + pokemon.ap / 100) * (crit ? 1 + (pokemon.critPower - 1) : 1)
    const allies = board.cells
      .filter<PokemonEntity>(
        (cell): cell is PokemonEntity =>
          cell !== undefined &&
          cell !== pokemon &&
          cell.team === pokemon.team &&
          cell.hp > 0
      )
      .sort(
        (a, b) =>
          distanceE(
            a.positionX,
            a.positionY,
            pokemon.positionX,
            pokemon.positionY
          ) -
          distanceE(
            b.positionX,
            b.positionY,
            pokemon.positionX,
            pokemon.positionY
          )
      )
      .slice(0, nbAllies)
    allies.forEach((ally) => {
      ally.status.triggerRage(rageDuration, ally)
    })
  }
}
