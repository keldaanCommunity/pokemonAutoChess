import { AttackType } from "../../types/enum/Game"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class InfernalParadeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const farthestTarget =
      pokemon.state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, board, farthestTarget, crit)

    const targetsHit = new Set<PokemonEntity>()
    const cells = board.getCellsBetween(
      pokemon.positionX,
      pokemon.positionY,
      farthestTarget.positionX,
      farthestTarget.positionY
    )

    cells.forEach((cell) => {
      if (cell.value && cell.value.team != pokemon.team) {
        targetsHit.add(cell.value)
      }
      pokemon.broadcastAbility({
        skill: "FLAME_HIT",
        positionX: cell.x,
        positionY: cell.y
      })
    })

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      if (chance(0.5, pokemon)) {
        enemy.status.triggerBurn(3000, enemy, pokemon)
      }

      enemy.handleSpecialDamage([30, 30, 30, 60][pokemon.stars - 1] ?? 60, board, AttackType.SPECIAL, pokemon, crit)
      enemy.commands.push(
        new DelayedCommand(() => {
          enemy.handleSpecialDamage(
            [30, 30, 30, 60][pokemon.stars - 1] ?? 60,
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
