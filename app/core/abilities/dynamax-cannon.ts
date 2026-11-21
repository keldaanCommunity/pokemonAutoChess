import { AbilityConfigs } from "../../config/game/abilities"
import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"

import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class DynamaxCannonStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damageRatio = [0.3, 0.4, 0.5, 0.7][pokemon.stars - 1] ?? 0.7
    const { positionX, positionY, orientation } = pokemon
    const ap = Math.round(pokemon.ap * (crit ? pokemon.critPower : 1))
    const { finalX, finalY } = board.getLineEnd(
      positionX,
      positionY,
      target.positionX,
      target.positionY
    )
    const cast = {
      positionX,
      positionY,
      orientation,
      targetX: finalX,
      targetY: finalY,
      ap
    }
    const { chargeDuration } = AbilityConfigs[Ability.DYNAMAX_CANNON]
    pokemon.broadcastAbility({ ...cast, skill: "DYNAMAX_CANNON_CHARGE" })

    pokemon.commands.push(
      new DelayedCommand(() => {
        const hits = board
          .getCellsBetween(positionX, positionY, finalX, finalY)
          .filter((cell) => cell.value && cell.value.team !== pokemon.team)
        pokemon.broadcastAbility({
          ...cast,
          skill: Ability.DYNAMAX_CANNON,
          data: { targets: hits.map(({ x, y }) => ({ x, y })) }
        })
        for (const cell of hits) {
          cell.value?.handleSpecialDamage(
            Math.ceil(cell.value.maxHP * damageRatio),
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      }, chargeDuration)
    )
  }
}
