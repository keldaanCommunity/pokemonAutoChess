import { AttackType } from "../../types/enum/Game"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ChatterStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const damage = [10, 20, 30, 60][pokemon.stars - 1] ?? 60
    const confusionChance = 0.5

    board
      .getCellsInRadius(pokemon.positionX, pokemon.positionY, 3, false)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          if (chance(confusionChance, pokemon)) {
            cell.value.status.triggerConfusion(1000, cell.value, pokemon)
          }
        }
      })
  }
}
