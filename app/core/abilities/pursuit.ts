import { AttackType } from "../../types/enum/Game"
import { distanceC } from "../../utils/distance"
import type { Board } from "../board"
import { OnMoveEffect } from "../effects/effect"
import { getMoveSpeed } from "../move-speed"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"
import { castAbility } from "./cast"

class PursuitEffect extends OnMoveEffect {
  pursuerId: string | null = null
  constructor(pursuier: PokemonEntity) {
    super(({ oldX, oldY, newX, newY, pokemon: target, board }) => {
      if (
        pursuier.hp > 0 &&
        pursuier.canMove &&
        distanceC(oldX, oldY, newX, newY) > 1
      ) {
        // TODO: jump and cast again
        const freeCellAround = board.getClosestAvailablePlace(newX, newY)
        if (!freeCellAround) return
        pursuier.orientation = board.orientation(
          pursuier.positionX,
          pursuier.positionY,
          freeCellAround.x,
          freeCellAround.y,
          pursuier
        )
        pursuier.moveTo(freeCellAround.x, freeCellAround.y, board, false)
        pursuier.targetX = newX
        pursuier.targetY = newY
        const moveCooldown = Math.round(500 / getMoveSpeed(pursuier))
        pursuier.commands.push(
          new DelayedCommand(() => {
            castAbility(new PursuitStrategy(), pursuier, board, target)
          }, moveCooldown)
        )
      }
    })
    this.pursuerId = pursuier.id
  }
}

export class PursuitStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [35, 70, 140, 280][pokemon.stars - 1] ?? 280
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    if (
      ![...target.effectsSet.values()].some(
        (effect) =>
          effect instanceof PursuitEffect && effect.pursuerId === pokemon.id
      )
    ) {
      const pursuitEffect = new PursuitEffect(pokemon)
      target.effectsSet.add(pursuitEffect)
    }
  }
}
