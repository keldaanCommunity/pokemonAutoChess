import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import { AccelerationEffect } from "../effects/passives/acceleration"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class SpinOutStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.round([0.25, 0.5, 1, 2][pokemon.stars - 1] * pokemon.speed)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerBlinded(1000, target, pokemon)

    // move back to your own backline
    // move to backline
    const corner = board.getTeleportationCell(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.team
    )
    if (corner) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.moveTo(corner.x, corner.y, board, false)
        }, 100)
      )
    }

    const accelerationEffect = [...pokemon.effectsSet.values()].find(
      (effect) => effect instanceof AccelerationEffect
    )
    if (accelerationEffect) {
      pokemon.addSpeed(
        -accelerationEffect.accelerationStacks * 15,
        pokemon,
        0,
        false
      )
      accelerationEffect.accelerationStacks = 0
    }
  }
}
