import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class WheelOfFireStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const damage = [10, 20, 40, 80][pokemon.stars - 1] ?? 80
    const farthestTarget =
      pokemon.state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, board, farthestTarget, crit)
    const targetsHit: Set<PokemonEntity> = new Set()

    const cells = board.getCellsBetween(
      pokemon.positionX,
      pokemon.positionY,
      farthestTarget.positionX,
      farthestTarget.positionY
    )

    cells.forEach((cell) => {
      if (cell.value && cell.value.team != pokemon.team) {
        pokemon.broadcastAbility({
          skill: "FLAME_HIT",
          positionX: cell.x,
          positionY: cell.y
        })
        targetsHit.add(cell.value)
      }
    })

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      enemy.commands.push(
        new DelayedCommand(() => {
          enemy.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }, 500)
      )
    })
  }
}
