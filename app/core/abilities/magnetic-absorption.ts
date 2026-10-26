import { AttackType } from "../../types/enum/Game"
import { distanceM } from "../../utils/distance"
import { min } from "../../utils/number"
import { shuffleArray } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class MagneticAbsorptionStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 100, 200][pokemon.stars - 1] ?? 200
    const baseSpeedStolen = 20
    const adjacentCells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY
    )
    const emptyCellsAround = adjacentCells
      .filter((v) => v.value === undefined)
      .map((v) => ({ x: v.x, y: v.y }))
      .sort((a, b) => {
        const distanceA = distanceM(
          a.x,
          a.y,
          target.positionX,
          target.positionY
        )
        const distanceB = distanceM(
          b.x,
          b.y,
          target.positionX,
          target.positionY
        )
        return distanceA - distanceB
      })
    if (
      emptyCellsAround.length > 0 &&
      distanceM(
        pokemon.positionX,
        pokemon.positionY,
        target.positionX,
        target.positionY
      ) > 1
    ) {
      const destination = emptyCellsAround[0]
      target.moveTo(destination.x, destination.y, board, true)
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      target.cooldown = min(600)(target.cooldown)
    }

    // stealing speed
    const speedBefore = target.speed
    target.addSpeed(-baseSpeedStolen, pokemon, 1, crit)
    const speedAfter = target.speed
    const speedStolen = min(0)(speedBefore - speedAfter)

    const adjacentAllies = board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
      .filter((cell) => cell.value && cell.value.team === pokemon.team)
      .map((cell) => cell.value!)

    for (const ally of adjacentAllies) {
      ally.addSpeed(
        Math.round(speedStolen / adjacentAllies.length),
        pokemon,
        0,
        false
      )
    }
    if (adjacentAllies.length === 0) {
      // if no allies, keep the speed
      pokemon.addSpeed(speedStolen, pokemon, 0, false)
    }
  }
}
