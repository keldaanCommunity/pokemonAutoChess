import { EffectEnum } from "../../types/enum/Effect"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ShelterStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const defGain = [3, 6, 12, 24][pokemon.stars - 1] ?? 24
    pokemon.addDefense(defGain, pokemon, 1, crit)
    board.addBoardEffect(
      pokemon.targetX,
      pokemon.targetY,
      EffectEnum.SMOKE,
      pokemon.simulation
    )
  }
}
