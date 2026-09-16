import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class DragonPulseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [10,15,20,40][pokemon.stars - 1] ?? 40

    pokemon.commands.push(
      new DelayedCommand(() => {
        if (target && target.hp > 0) {
          target.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )

          pokemon.addAbilityPower(5, pokemon, 0, false, false)
          board
            .getAdjacentCells(target.positionX, target.positionY, false)
            .filter((cell) => cell.value && cell.value.team !== pokemon.team)
            .forEach((cell) => {
              if (cell.value) {
                pokemon.broadcastAbility({
                  positionX: target.positionX,
                  positionY: target.positionY,
                  targetX: cell.x,
                  targetY: cell.y
                })
                cell.value.handleSpecialDamage(
                  damage,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit
                )
                pokemon.addAbilityPower(5, pokemon, 0, false, false)

                pokemon.commands.push(
                  new DelayedCommand(() => {
                    if (pokemon && cell.value) {
                      board
                        .getAdjacentCells(
                          cell.value.positionX,
                          cell.value.positionY,
                          false
                        )
                        .filter((c) => c.value && c.value.team !== pokemon.team)
                        .forEach((c) => {
                          pokemon.broadcastAbility({
                            positionX: cell.x,
                            positionY: cell.y,
                            targetX: c.x,
                            targetY: c.y
                          })
                          c.value?.handleSpecialDamage(
                            damage,
                            board,
                            AttackType.SPECIAL,
                            pokemon,
                            crit
                          )
                          pokemon.addAbilityPower(5, pokemon, 0, false, false)
                        })
                    }
                  }, 400)
                )
              }
            })
        }
      }, 400)
    )
  }
}
