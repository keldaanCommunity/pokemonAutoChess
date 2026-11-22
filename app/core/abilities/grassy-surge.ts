import { Synergy } from "../../types/enum/Synergy"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class GrassySurgeStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const buff = [5, 5, 5, 10][pokemon.stars - 1] ?? 10
    const allies: { x: number; y: number }[] = []
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (
        ally &&
        ally.id !== pokemon.id &&
        pokemon.team === ally.team &&
        ally.hasSynergy(Synergy.GRASS)
      ) {
        allies.push({ x, y })
        ally.addAttack(buff, pokemon, 1, crit)
      }
    })
    pokemon.broadcastAbility({
      ap: Math.round(pokemon.ap * (crit ? pokemon.critPower : 1)),
      data: { allies }
    })
  }
}
