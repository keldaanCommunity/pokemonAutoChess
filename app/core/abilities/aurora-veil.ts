import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class AuroraVeilStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const runeProtectDuration = 1000
    const shield = [5, 10, 20, 50][pokemon.stars - 1] ?? 50

    board.forEach((x, y, tg) => {
      if (tg && pokemon.team == tg.team) {
        tg.addShield(shield, pokemon, 1, crit)
        tg.status.triggerRuneProtect(runeProtectDuration, tg, pokemon)
      }
    })
  }
}
