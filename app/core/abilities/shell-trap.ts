import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import { OnShieldDepletedEffect } from "../effects/effect"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ShellTrapStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    if (pokemon.shield > 0) {
      const damage = ([50, 50, 50, 100][pokemon.stars - 1] ?? 100) + pokemon.shield
      board
        .getAdjacentCells(pokemon.positionX, pokemon.positionY, true)
        .forEach((cell) => {
          if (cell.value && pokemon.team != cell.value.team) {
            cell.value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        })
      pokemon.shield = 0
      pokemon.getEffects(OnShieldDepletedEffect).forEach((effect) => {
        effect.apply({
          pokemon,
          board: pokemon.simulation.board,
          attacker: pokemon as PokemonEntity,
          damage
        })
      })
    } else {
      const shield = [25, 50, 75, 150][pokemon.stars - 1] ?? 150
      pokemon.addShield(shield, pokemon, 1, crit)
    }
  }
}
