import { AttackType } from "../../types/enum/Game"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class FieryWrathStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30,40,50,80][pokemon.stars - 1]

    board
      .getCellsInRadius(pokemon.positionX, pokemon.positionY, 4, false)
      .forEach((cell) => {
        const unit = cell.value
        if (unit && pokemon.team !== unit.team) {
          if (chance(0.5, pokemon)) {
            unit.status.triggerFlinch(4000, unit, pokemon)
          }
          unit.handleSpecialDamage(
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
