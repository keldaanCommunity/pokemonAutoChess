import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class MalignantChainStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const duration = Math.round(
      ([3000, 3000, 3000, 6000][pokemon.stars - 1] ?? 6000) * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
    )
    target.status.triggerPossessed(duration, target, pokemon)
    const nbStacks = [3, 3, 3, 6][pokemon.stars - 1] ?? 6
    for (let i = 0; i < nbStacks; i++) {
      target.status.triggerPoison(duration, target, pokemon)
    }
  }
}
