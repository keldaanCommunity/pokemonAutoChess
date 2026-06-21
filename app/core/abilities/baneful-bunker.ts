import { AttackType } from "../../types/enum/Game"
import { distanceC } from "../../utils/distance"
import type { Board } from "../board"
import { OnAttackReceivedEffect } from "../effects/effect"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class BanefulBunkerStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const duration = 2000
    pokemon.status.triggerProtect(duration)

    const bunkerEffect = new OnAttackReceivedEffect(({ attacker }) => {
      if (
        distanceC(
          pokemon.positionX,
          pokemon.positionY,
          attacker.positionX,
          attacker.positionY
        ) === 1
      ) {
        const damage = [10, 20, 30, 50][pokemon.stars - 1] ?? 50
        attacker.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          false
        )
        attacker.status.triggerPoison(3000, attacker, pokemon)
      }
    })

    pokemon.effectsSet.add(bunkerEffect)
    pokemon.commands.push(
      new DelayedCommand(
        () => pokemon.effectsSet.delete(bunkerEffect),
        duration
      )
    )

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.setTarget(pokemon)
        pokemon.broadcastAbility({
          skill: "TAUNT_HIT",
          targetX: cell.value.positionX,
          targetY: cell.value.positionY
        })
      }
    })
  }
}
