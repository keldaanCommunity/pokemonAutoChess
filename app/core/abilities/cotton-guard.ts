import { EffectEnum } from "../../types/enum/Effect"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class CottonGuardStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const cells = board.getCellsInFront(pokemon, target)
    const shield = [15, 30, 60, 120][pokemon.stars - 1] ?? 120
    pokemon.addShield(shield, pokemon, 1, crit)
    pokemon.addDefense(3, pokemon, 1, crit)
    cells.forEach((cell) => {
      board.addBoardEffect(
        cell.x,
        cell.y,
        EffectEnum.COTTON_BALL,
        pokemon.simulation
      )
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.status.triggerSleep(1000, cell.value)
      }
    })
  }
}
