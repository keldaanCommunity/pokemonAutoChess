import { AttackType } from "../../types/enum/Game"
import { OrientationVector } from "../../utils/orientation"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class SkitterSmackStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Skitters behind the target to attack, dealing [15,30,60,SP] SPECIAL. This also lowers the target's AP by 20.
    const damage = [15, 30, 60, 120][pokemon.stars - 1] ?? 120

    pokemon.orientation = board.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      target
    )
    const [dx, dy] = OrientationVector[pokemon.orientation]

    const nextX = target.positionX + dx
    const nextY = target.positionY + dy

    const behindCell = board.getClosestAvailablePlace(nextX, nextY)
    if (behindCell) {
      pokemon.moveTo(behindCell.x, behindCell.y, board, true)
    }
    pokemon.commands.push(
      new DelayedCommand(() => {
        if (target.hp > 0) {
          target.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          target.addAbilityPower(-20, pokemon, 0, false)
        }
      }, 300)
    )
  }
}
