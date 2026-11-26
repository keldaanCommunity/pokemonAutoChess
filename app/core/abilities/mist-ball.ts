import { AbilityConfigs } from "../../config/game/abilities"
import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import { distanceC } from "../../utils/distance"
import type { Board } from "../board"
import { effectInLine } from "../board"

import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class MistBallStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const positionX = pokemon.positionX
    const positionY = pokemon.positionY
    const orientation = pokemon.orientation
    const targetX = target.positionX
    const targetY = target.positionY
    const ap = Math.round(pokemon.ap * (crit ? pokemon.critPower : 1))
    const targets: { x: number; y: number }[] = []
    const damage = [10, 20, 30, 60, 120][pokemon.stars - 1] ?? 120

    effectInLine(board, pokemon, target, (cell) => {
      if (
        cell.value != null &&
        cell.value.team !== pokemon.team &&
        distanceC(
          pokemon.positionX,
          pokemon.positionY,
          cell.value.positionX,
          cell.value.positionY
        ) <= 4
      ) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.addAbilityPower(
          -([30, 30, 30, 60][pokemon.stars - 1] ?? 60),
          pokemon,
          0,
          false
        )
        targets.push({ x: cell.x, y: cell.y })
      }
    })

    pokemon.broadcastAbility({
      skill: Ability.MIST_BALL,
      positionX,
      positionY,
      orientation,
      targetX,
      targetY,
      ap
    })
    pokemon.broadcastAbility({
      skill: "MIST_BALL_HIT",
      positionX,
      positionY,
      orientation,
      targetX,
      targetY,
      ap,
      data: { phase: "outbound", targets }
    })

    pokemon.commands.push(
      new DelayedCommand(() => {
        const returnTargets: { x: number; y: number }[] = []
        effectInLine(board, pokemon, target, (cell) => {
          if (cell.value != null && cell.value.team !== pokemon.team) {
            cell.value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
            cell.value.addAbilityPower(
              -([30, 30, 30, 60][pokemon.stars - 1] ?? 60),
              pokemon,
              0,
              false
            )
            returnTargets.push({ x: cell.x, y: cell.y })
          }
        })
        pokemon.broadcastAbility({
          skill: "MIST_BALL_HIT",
          ap,
          data: {
            phase: "return",
            targets: returnTargets,
            travel: { positionX, positionY, targetX, targetY }
          }
        })
      }, AbilityConfigs[Ability.MIST_BALL].returnDelay)
    )
  }
}
