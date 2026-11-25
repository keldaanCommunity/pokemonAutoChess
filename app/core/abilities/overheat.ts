import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class OverheatStrategy extends AbilityStrategy {
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
    const skill = pokemon.skill
    const ap = Math.round(pokemon.ap * (crit ? pokemon.critPower : 1))
    const targetX = target.positionX
    const targetY = target.positionY
    const cells = board.getCellsInRadius(targetX, targetY, 4, true)
    const targets: { x: number; y: number }[] = []
    cells.forEach((cell) => {
      const unit = cell.value
      if (unit && pokemon.team !== unit.team) {
        targets.push({ x: cell.x, y: cell.y })
        let damage = [12, 25, 50, 100][pokemon.stars - 1] ?? 100
        if (unit.status.burn) {
          damage = Math.round(damage * 1.3)
        }
        unit.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
      if (unit && unit.status.freeze) {
        unit.status.freezeCooldown = 0
      }
    })
    pokemon.broadcastAbility({
      skill,
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
