import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class PollenPuffStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const lowestHealthAlly = (
      board.cells.filter(
        (cell) => cell && cell.team === pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.hp - b.hp)[0]

    if (lowestHealthAlly) {
      const heal = [30, 60, 120, 240][pokemon.stars - 1] ?? 240
      lowestHealthAlly.handleHeal(heal, pokemon, 1, crit)
      pokemon.broadcastAbility({
        targetX: lowestHealthAlly.positionX,
        targetY: lowestHealthAlly.positionY
      })
    }
  }
}
