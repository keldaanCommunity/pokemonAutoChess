import { BOARD_HEIGHT } from "../../config"
import { AttackType, Team } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class GlaiveRushStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [50, 100, 200, 400][pokemon.stars - 1] ?? 400
    pokemon.status.triggerArmorReduction(6000, pokemon)
    const destinationRow =
      pokemon.team === Team.RED_TEAM
        ? pokemon.positionY <= 1
          ? BOARD_HEIGHT - 1
          : 0
        : pokemon.positionY >= BOARD_HEIGHT - 2
          ? 0
          : BOARD_HEIGHT - 1

    const destination = board.getClosestAvailablePlace(
      pokemon.positionX,
      destinationRow
    )
    const enemiesHit = new Set<PokemonEntity>()
    if (destination) {
      pokemon.broadcastAbility({
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: destination.x,
        targetY: destination.y
      })
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        destination.x,
        destination.y
      )
      pokemon.moveTo(destination.x, destination.y, board, false)

      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          enemiesHit.add(cell.value)
        }
      })
    }

    if (enemiesHit.size === 0) enemiesHit.add(target) // ensure to at least hit the target
    enemiesHit.forEach((enemy) => {
      enemy.status.triggerArmorReduction(6000, pokemon)
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}
