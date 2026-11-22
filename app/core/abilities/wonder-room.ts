import { EffectEnum } from "../../types/enum/Effect"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class WonderRoomStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .forEach((cell) => {
        const enemy = cell.value
        if (enemy && enemy.team !== pokemon.team) {
          enemy.effects.add(EffectEnum.WONDER_ROOM)
          enemy.commands.push(
            new DelayedCommand(() => {
              enemy.effects.delete(EffectEnum.WONDER_ROOM)
            }, 5000)
          )
        }
      })
  }
}
