import { AttackType } from "../../types/enum/Game"
import { OrientationArray } from "../../utils/orientation"
import type { Board } from "../board"
import { effectInOrientation } from "../board"

import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SpikyShieldStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const shouldTriggerSpikeAnimation = pokemon.status.spikeArmor
    super.process(pokemon, board, target, crit, !shouldTriggerSpikeAnimation)
    const defMultiplier = [0.6, 0.8, 1, 2][pokemon.stars - 1] ?? 2
    const defDamage = Math.round(defMultiplier * pokemon.def)
    target.handleSpecialDamage(defDamage, board, AttackType.SPECIAL, pokemon, crit)
    if (pokemon.status.spikeArmor) {
      const damage = [30, 30, 30, 60][pokemon.stars - 1] ?? 60
      OrientationArray.forEach((orientation) => {
        effectInOrientation(board, pokemon, orientation, (cell) => {
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
      })
    }
    const duration = [3000, 5000, 10000, 10000][pokemon.stars - 1] ?? 10000
    pokemon.status.triggerSpikeArmor(duration)
  }
}
