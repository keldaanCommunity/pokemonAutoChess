import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class BounceStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const nbBounces = [1, 2, 3, 4][pokemon.stars - 1] ?? 4
    for (let i = 0; i < nbBounces; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          const destination =
            board.getFarthestTargetCoordinateAvailablePlace(pokemon)
          if (destination && pokemon.maxHP > 0) {
            pokemon.broadcastAbility({})
            pokemon.moveTo(destination.x, destination.y, board, false)
            const adjacentCells = board.getAdjacentCells(
              destination.x,
              destination.y
            )
            adjacentCells.forEach((cell) => {
              if (cell.value && cell.value.team !== pokemon.team) {
                const damage = [15, 20, 25, 30][pokemon.stars - 1] ?? 30
                cell.value.handleSpecialDamage(
                  damage,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit
                )
              }
            })
          }
        }, i * 500)
      )
    }
  }
}
