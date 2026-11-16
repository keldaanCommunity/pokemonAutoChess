import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class HyperspaceFuryStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const nbHits = Math.round(
      ([1, 2, 3, 4, 8][pokemon.stars - 1] ?? 8) *
        (1 + pokemon.ap / 100) *
        (crit ? pokemon.critPower : 1)
    )
    for (let i = 0; i < nbHits; i++) {
      target.addDefense(-1, pokemon, 0, false)
      target.addSpecialDefense(-1, pokemon, 0, false)
      target.handleSpecialDamage(
        15,
        board,
        AttackType.SPECIAL,
        pokemon,
        false,
        false
      )
    }
    pokemon.broadcastAbility({
      targetX: target.positionX,
      targetY: target.positionY,
      orientation: nbHits // use orientation field for the number of hits
    })
  }
}
