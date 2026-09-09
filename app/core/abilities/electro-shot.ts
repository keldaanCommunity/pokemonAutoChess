import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import { Weather } from "../../types/enum/Weather"
import type { Board } from "../board"
import { effectInLine } from "../board"

import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class ElectroShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    if (pokemon.simulation.weather !== Weather.STORM) {
      pokemon.cooldown = 2000
      pokemon.broadcastAbility({
        skill: "ELECTRO_SHOT_CHARGE",
        positionX: pokemon.positionX,
        positionY: pokemon.positionY
      })
    }

    pokemon.commands.push(
      new DelayedCommand(
        () => {
          const damage = [80, 100, 120, 240][pokemon.stars - 1] ?? 240
          const apBoost = 40
          pokemon.addAbilityPower(apBoost, pokemon, 0, false)
          pokemon.broadcastAbility({
            skill: Ability.ELECTRO_SHOT,
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
        },
        pokemon.simulation.weather === Weather.STORM ? 0 : 2000
      )
    )
  }
}
