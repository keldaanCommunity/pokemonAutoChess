import { Passive } from "../../types/enum/Passive";
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class TimeTravelStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const heal = [25, 25, 25, 50][pokemon.stars - 1] ?? 50
    board.forEach((x, y, ally) => {
      if (ally && pokemon.team == ally.team) {
        ally.handleHeal(heal, pokemon, 1, crit)
        ally.status.clearNegativeStatus(ally, pokemon)
      }
    })

    if (
      pokemon.player &&
      !pokemon.isGhostOpponent &&
      pokemon.player.life < 100 &&
      pokemon.passive === Passive.CELEBI
    ) {
      pokemon.player.life += 1
      pokemon.addStack()
    }
  }
}
