import { AttackType } from "../../types/enum/Game"
import { min } from "../../utils/number"
import { shuffleArray } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class AnchorShotStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    const damage = [20, 40, 80, 160][pokemon.stars - 1] ?? 160
    const farthestTarget = pokemon.state.getFarthestTarget(pokemon, board)
    if (!farthestTarget) return
    super.process(pokemon, board, farthestTarget, crit, true)
    const adjacentCells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY
    )
    const emptyCellsAround = shuffleArray(
      adjacentCells
        .filter((v) => v.value === undefined)
        .map((v) => ({ x: v.x, y: v.y }))
    )
    if (emptyCellsAround.length > 0) {
      const destination = emptyCellsAround[0]
      pokemon.broadcastAbility({
        targetX: farthestTarget.positionX,
        targetY: farthestTarget.positionY
      })
      farthestTarget.moveTo(destination.x, destination.y, board, true)
      farthestTarget.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      farthestTarget.cooldown = min(750)(farthestTarget.cooldown)
    }
  }
}
