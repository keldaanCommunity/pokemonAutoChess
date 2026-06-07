import { EffectEnum } from "../../types/enum/Effect"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class StrangeSteamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    board
      .getCellsInRadius(
        pokemon.positionX,
        pokemon.positionY,
        pokemon.count.ult,
        true
      )
      .forEach((cell) => {
        board.addBoardEffect(
          cell.x,
          cell.y,
          EffectEnum.STRANGE_STEAM_BOARD_EFFECT,
          pokemon.simulation
        )
        if (cell.value && cell.value.team !== pokemon.team) {
          if (chance([0.3, 0.3, 1.0, 1.0][pokemon.stars - 1] ?? 1.0, pokemon)) {
            cell.value.status.triggerConfusion(3000, cell.value, pokemon)
          }
        } else if (cell.value && cell.value.team === pokemon.team) {
          cell.value.status.addFairyField(cell.value)
        }
      })
  }
}
