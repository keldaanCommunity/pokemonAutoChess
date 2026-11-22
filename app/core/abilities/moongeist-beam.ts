import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import { effectInLine } from "../board"

import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class MoongeistBeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const targetX = target.positionX
    const targetY = target.positionY
    const ap = Math.round(pokemon.ap * (crit ? pokemon.critPower : 1))
    const targets: { x: number; y: number }[] = []

    super.process(pokemon, board, target, crit, true)
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null) {
        if (cell.value.team !== pokemon.team) {
          cell.value.status.triggerParalysis(3000, cell.value, pokemon)
          cell.value.handleSpecialDamage(
            [60, 80, 100, 200][pokemon.stars - 1] ?? 200,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          targets.push({ x: cell.x, y: cell.y })
        } else if (cell.value.id !== pokemon.id) {
          cell.value.addShield(
            [60, 80, 100, 200][pokemon.stars - 1] ?? 200,
            pokemon,
            1,
            crit
          )
          targets.push({ x: cell.x, y: cell.y })
        }
      }
    })
    pokemon.broadcastAbility({
      targetX,
      targetY,
      ap,
      data: { targets }
    })
  }
}
