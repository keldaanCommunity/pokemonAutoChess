import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SludgeWaveStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const duration = Math.round(
      ([2000, 3000, 4000, 8000, 15000][pokemon.stars - 1] ?? 15000) *
        (1 + pokemon.ap / 100) *
        (crit ? pokemon.critPower : 1)
    )
    const damage = [10, 20, 40, 80, 150][pokemon.stars - 1] ?? 150
    board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          cell.value.status.triggerPoison(duration, cell.value, pokemon)
          cell.value.handleSpecialDamage(
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
