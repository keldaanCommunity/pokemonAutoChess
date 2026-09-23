import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class AquaStepStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [25, 50, 100, 200][pokemon.stars - 1] ?? 200
    const speedGain = [10, 15, 20, 25][pokemon.stars - 1] ?? 25

    const dx = target.positionX - pokemon.positionX
    const dy = target.positionY - pokemon.positionY
    const stepCell = board.getClosestAvailablePlace(
      pokemon.positionX + Math.sign(dx),
      pokemon.positionY + Math.sign(dy)
    )
    if (stepCell) {
      pokemon.moveTo(stepCell.x, stepCell.y, board, false)
    }

    pokemon.commands.push(
      new DelayedCommand(() => {
        pokemon.broadcastAbility({
          targetX: target.positionX,
          targetY: target.positionY
        })
        target.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        pokemon.addSpeed(speedGain, pokemon, 1, crit)
      }, 300)
    )
  }
}
