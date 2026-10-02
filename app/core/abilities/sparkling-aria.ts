import { EffectEnum } from "../../types/enum/Effect"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class SparklingAriaStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [15, 25, 50, 100][pokemon.stars - 1] ?? 100
    const cells = board.getAdjacentCells(target.positionX, target.positionY)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    cells.forEach((cell) => {
      const entity = cell.value
      if (entity && entity.team !== pokemon.team) {
        entity.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      } else if (entity && entity.team === pokemon.team && entity.status.burn) {
        entity.status.healBurn(entity)
        entity.effects.add(EffectEnum.IMMUNITY_BURN)
        entity.commands.push(
          new DelayedCommand(() => {
            entity.effects.delete(EffectEnum.IMMUNITY_BURN)
          }, 3000)
        )
      }
    })
  }
}
