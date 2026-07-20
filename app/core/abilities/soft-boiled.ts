import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SoftBoiledStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const shield = [20, 40, 80, 160][pokemon.stars - 1] ?? 160
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team == tg.team) {
        pokemon.broadcastAbility({ positionX: x, positionY: y })
        tg.addShield(shield, pokemon, 1, crit)
        tg.status.clearNegativeStatus(tg, pokemon)
      }
    })
  }
}
