import { AbilityConfigs } from "../../config/game/abilities"
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
      positionY: pokemon.positionY,
      targetX: target.positionX,
      targetY: target.positionY
    })

    pokemon.commands.push(
      new DelayedCommand(() => {
        const damage = [65, 130, 250, 500][pokemon.stars - 1] ?? 500
        const { positionX, positionY, orientation } = pokemon
        const ap = Math.round(pokemon.ap * (crit ? pokemon.critPower : 1))
        const targets: { x: number; y: number }[] = []
        const { finalX, finalY } = effectInLine(
          board,
          pokemon,
          target,
          (cell) => {
            if (cell.value != null && cell.value.team !== pokemon.team) {
              targets.push({ x: cell.x, y: cell.y })
              cell.value.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
            }
          }
        )
        pokemon.broadcastAbility({
          skill: Ability.HYPER_BEAM,
          positionX,
          positionY,
          orientation,
          targetX: finalX,
          targetY: finalY,
          ap,
          data: { targets }
        })
        pokemon.status.triggerFatigue(5000, pokemon, pokemon)
      }, AbilityConfigs[Ability.HYPER_BEAM].chargeDuration)
    )
  }
}
