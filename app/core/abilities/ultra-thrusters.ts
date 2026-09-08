import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class UltraThrustersStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [20, 40, 80, 160][pokemon.stars - 1] ?? 160
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          cell.value.status.triggerBurn(2000, cell.value, pokemon)
        }
      })

    // move to backline
    const corner = board.getTeleportationCell(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.team
    )

    pokemon.broadcastAbility({
      skill: Ability.ULTRA_THRUSTERS,
      positionX: pokemon.positionX,
      positionY: pokemon.positionY,
      targetX: corner?.x ?? pokemon.targetX,
      targetY: corner?.y ?? pokemon.targetY,
      orientation: pokemon.orientation
    })

    if (corner) {
      pokemon.orientation = board.orientation(
        corner.x,
        corner.y,
        pokemon.positionX,
        pokemon.positionY,
        pokemon,
        target
      )
      pokemon.moveTo(corner.x, corner.y, board, false)
      pokemon.resetCooldown(600)
    }
  }
}
