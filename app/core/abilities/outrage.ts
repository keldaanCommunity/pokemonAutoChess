import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class OutrageStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    pokemon.status.triggerConfusion(2000, pokemon, pokemon)
    const damage = Math.round(pokemon.atk * ([3, 3, 3, 6][pokemon.stars - 1] ?? 6))
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .map((v) => v.value)
      .filter((v) => v?.team === target.team && v?.id !== target.id)
      .concat(target)
      .forEach((v) => {
        if (v) {
          pokemon.broadcastAbility({
            targetX: v.positionX,
            targetY: v.positionY
          })
          v.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
  }
}
