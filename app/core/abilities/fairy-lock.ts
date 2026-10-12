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
    super.process(pokemon, board, target, crit)
    target.status.triggerLocked(5000, target)

    const cells = board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .filter((cell) => cell && cell.value && cell.value.team !== pokemon.team)

    const damage = [50,70,90,180][pokemon.stars - 1] ?? 180

    cells.forEach((cell) => {
      pokemon.broadcastAbility({ targetX: cell.x, targetY: cell.y })
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
