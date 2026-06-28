import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class WishStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    //  Grant 30/60/120 shield and 1 second Protect to the lowest % HP ally.
    const lowestHealthAlly = (
      board.cells.filter(
        (cell) => cell && cell.team === pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.hp / a.maxHP - b.hp / b.maxHP)[0]
    const shield = [30, 60, 120, 240][pokemon.stars - 1] ?? 240
    lowestHealthAlly.addShield(shield, pokemon, 1, crit)
    lowestHealthAlly.status.triggerProtect(1500)
  }
}
