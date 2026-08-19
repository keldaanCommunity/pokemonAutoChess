import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class FairyWindStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const flatPPGain = [2.5, 5, 10, 20][pokemon.stars - 1] ?? 20
    const ppGainWithAP = flatPPGain * (2 + pokemon.ap / 100)
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team === tg.team && tg.id !== pokemon.id) {
        tg.addPP(ppGainWithAP, pokemon, 0, crit)
      }
    })
  }
}
