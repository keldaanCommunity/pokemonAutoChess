import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class OverheatStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    board
      .getCellsInRadius(target.positionX, target.positionY, 4, true)
      .forEach((cell) => {
        const unit = cell.value
        if (unit && pokemon.team !== unit.team) {
          let damage = [12, 25, 50, 100][pokemon.stars - 1] ?? 100
          if (unit.status.burn) {
            damage = Math.round(damage * 1.3)
          }
          unit.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
        if (unit && unit.status.freeze) {
          unit.status.freezeCooldown = 0
        }
      })
  }
}
