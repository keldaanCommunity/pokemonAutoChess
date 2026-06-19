import { EffectEnum } from "../../types/enum/Effect"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ShadowPunchStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const lowestHealthEnemy = (
      board.cells.filter(
        (cell) => cell && cell.team !== pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.hp / a.maxHP - b.hp / b.maxHP)[0]

    if (lowestHealthEnemy) {
      const coord = pokemon.simulation.getClosestFreeCellToPokemonEntity(
        lowestHealthEnemy,
        (lowestHealthEnemy.team + 1) % 2
      )
      if (coord) {
        pokemon.orientation = board.orientation(
          coord.x,
          coord.y,
          pokemon.positionX,
          pokemon.positionY,
          pokemon,
          lowestHealthEnemy
        )
        pokemon.moveTo(coord.x, coord.y, board, false)
      }
      pokemon.effects.add(EffectEnum.SHADOW_PUNCH_NEXT_ATTACK)
    }
  }
}
