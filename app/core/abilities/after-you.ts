import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { getStrongestUnit } from "../unit-score"
import { AbilityStrategy } from "./ability-strategy"

export class AfterYouStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    //Gives [5,10,15,30,SP] PP and [10,10,10,20,SP] SPEED buff to the strongest closest ally.
    const ppGain = [5, 10, 15, 30][pokemon.stars - 1] ?? 30
    const speedGain = [10, 10, 10, 20][pokemon.stars - 1] ?? 20
    const nearestAllies = pokemon.state.getNearestAllies(pokemon, board)
    const strongestNearestAlly = getStrongestUnit(nearestAllies)
    if (strongestNearestAlly) {
      strongestNearestAlly.addPP(ppGain, pokemon, 1, crit)
      strongestNearestAlly.addSpeed(speedGain, pokemon, 1, crit)
    }
  }
}
