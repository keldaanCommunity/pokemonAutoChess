import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SearingShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const positionX = pokemon.positionX
    const positionY = pokemon.positionY
    const orientation = pokemon.orientation
    const targetX = target.positionX
    const targetY = target.positionY
    const ap = Math.round(pokemon.ap * (crit ? pokemon.critPower : 1))
    const damage = [30, 40, 50, 100][pokemon.stars - 1] ?? 100
    const burnDuration = [3000, 3000, 3000, 6000][pokemon.stars - 1] ?? 6000
    const cells = board.getCellsInRadius(positionX, positionY, 2, false)
    const targets: { x: number; y: number }[] = []
    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        targets.push({ x: cell.x, y: cell.y })
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerBurn(burnDuration, cell.value, pokemon)
      }
    })
    pokemon.broadcastAbility({
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
