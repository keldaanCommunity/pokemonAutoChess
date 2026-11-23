import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class BoomBurstStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    // Deal 60 special damage to all adjacent units including allies
    super.process(pokemon, board, target, crit, true)
    const positionX = pokemon.positionX
    const positionY = pokemon.positionY
    const orientation = pokemon.orientation
    const targetX = target ? target.positionX : -1
    const targetY = target ? target.positionY : -1
    const ap = Math.round(pokemon.ap * (crit ? pokemon.critPower : 1))
    const targets: { x: number; y: number }[] = []
    const damage = [60, 60, 60, 120][pokemon.stars - 1] ?? 120
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
      .forEach((cell) => {
        if (cell.value) {
          targets.push({ x: cell.x, y: cell.y })
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          cell.value.status.triggerFlinch(4000, cell.value, pokemon)
        }
      })
    pokemon.broadcastAbility({
      skill: Ability.BOOMBURST,
      positionX,
      positionY,
      orientation,
      targetX,
      targetY,
      ap,
      data: { targets }
    })
  }
}
