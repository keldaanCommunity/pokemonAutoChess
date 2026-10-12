import { EffectEnum } from "../../types/enum/Effect"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class UproarStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    // Deal [5,10,20,40,SP] SPECIAL every second for 3 seconds to all enemies at attack range;
    // during this time, allies in the area are immune to SLEEP.

    board
      .getCellsInRange(
        pokemon.positionX,
        pokemon.positionY,
        pokemon.range,
        true
      )
      .forEach((cell) => {
        if (
          cell.value &&
          pokemon.team === cell.value.team &&
          !cell.value.effects.has(EffectEnum.IMMUNITY_SLEEP)
        ) {
          cell.value.effects.add(EffectEnum.IMMUNITY_SLEEP)
          cell.value.commands.push(
            new DelayedCommand(() => {
              cell.value?.effects.delete(EffectEnum.IMMUNITY_SLEEP)
            }, 3000)
          )
        }
      })

    for (let i = 1; i <= 3; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          const damage = [5, 10, 20, 40][pokemon.stars - 1] ?? 40
          pokemon.broadcastAbility()
          board
            .getCellsInRange(
              pokemon.positionX,
              pokemon.positionY,
              pokemon.range,
              false
            )
            .forEach((cell) => {
              if (cell.value && pokemon.team != cell.value.team) {
                cell.value.handleSpecialDamage(
                  damage,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit
                )
              }
            })
        }, i * 1000)
      )
    }
  }
}
