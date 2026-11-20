import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class FairyLockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const cells = board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .filter((cell) => cell && cell.value && cell.value.team !== pokemon.team)

    pokemon.broadcastAbility({
      targetX: target.positionX,
      targetY: target.positionY,
      ap: Math.round(pokemon.ap * (crit ? pokemon.critPower : 1)),
      data: {
        targets: cells
          .filter(
            (cell) => cell.x !== target.positionX || cell.y !== target.positionY
          )
          .map(({ x, y }) => ({ x, y }))
      }
    })

    target.status.triggerLocked(5000, target)

    const damage = [50, 70, 90, 180][pokemon.stars - 1] ?? 180

    cells.forEach((cell) => {
      cell.value?.handleSpecialDamage(
        Math.round(damage / cells.length),
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}
