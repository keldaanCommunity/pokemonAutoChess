import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SnoreStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Deal [20,40,60,SP] SPECIAL to the 3 enemy Pokémon in front, causing them to FLINCH for 3 seconds.
    const damage = [20, 40, 60, 120][pokemon.stars - 1] ?? 120
    const targets = board
      .getCellsInFront(pokemon, target)
      .filter((cell) => cell.value && cell.value.team !== pokemon.team)

    for (const cell of targets) {
      if (cell.value) {
        cell.value.status.triggerFlinch(3000, pokemon)
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    }
  }
}
