import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class NuzzleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const destination = board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    target = destination?.target ?? target
    super.process(pokemon, board, target, crit)

    const damage = [25, 50, 100, 200][pokemon.stars - 1] ?? 200
    const duration = [3000,3000,3000,6000][pokemon.stars - 1] ?? 6000

    if (destination) {
      pokemon.setTarget(destination.target)
      pokemon.moveTo(destination.x, destination.y, board, false)
    }

    target.status.triggerParalysis(duration, target, pokemon)
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}
