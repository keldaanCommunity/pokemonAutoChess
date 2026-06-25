import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import { effectInLine } from "../board"

import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class HyperBeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    pokemon.cooldown = 1000
    pokemon.broadcastAbility({
      skill: "HYPER_BEAM_CHARGE",
      positionX: pokemon.positionX,
      positionY: pokemon.positionY
    })

    pokemon.commands.push(
      new DelayedCommand(() => {
        const damage = [50, 100, 150, 300][pokemon.stars - 1] ?? 300
        pokemon.broadcastAbility({
          skill: Ability.HYPER_BEAM,
          targetX: target.positionX,
          targetY: target.positionY
        })
        effectInLine(board, pokemon, target, (cell) => {
          if (cell.value != null && cell.value.team !== pokemon.team) {
            cell.value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        })
        pokemon.status.triggerFatigue(5000, pokemon, pokemon)
      }, 1000)
    )
  }
}
