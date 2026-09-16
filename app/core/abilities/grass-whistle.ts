import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class GrassWhistleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let n = [1,2,4,8][pokemon.stars - 1] ?? 8
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team && n > 0) {
        tg.status.triggerSleep(2000, tg)
        n--
      }
    })
  }
}
