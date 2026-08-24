import { AttackType } from "../../types/enum/Game"
import { max } from "../../utils/number"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class AccelerockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const destination = board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    target = destination?.target ?? target
    super.process(pokemon, board, target, crit)
    if (destination) {
      pokemon.moveTo(destination.x, destination.y, board, false)
      pokemon.setTarget(destination.target)
    }
    const damageFactor = [1, 1.25, 2.5][pokemon.stars - 1] ?? 2.5
    target.handleSpecialDamage(
      pokemon.atk * damageFactor,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )

    const nbEffects = max(Math.floor(pokemon.def / 2))(
      Math.round(5 * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1))
    )
    pokemon.addDefense(-2 * nbEffects, pokemon, 0, false)
    pokemon.addSpeed(nbEffects * 5, pokemon, 0, false)
  }
}
