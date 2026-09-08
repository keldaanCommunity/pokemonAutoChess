import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class BlizzardStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const freezeDuration = 1500
    const damage = [10, 20, 40, 80][pokemon.stars - 1] ?? 80
    board
      .getCellsInRadius(pokemon.positionX, pokemon.positionY, 4, false)
      .forEach((cell) => {
        if (cell.value && pokemon.team != cell.value.team) {
          const enemy = cell.value
          enemy.handleSpecialDamage(
            enemy.status.freeze ? Math.round(damage * 1.3) : damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          enemy.status.triggerFreeze(freezeDuration, enemy, pokemon)
        }
      })
  }
}
