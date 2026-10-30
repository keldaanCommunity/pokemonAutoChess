import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class KowtowCleaveStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const nbFallenAllies = board.getFallenAlliesCount(pokemon)
    const damage = Math.round(
      pokemon.atk *
        (1.5 +
          nbFallenAllies *
            ([0.2, 0.2, 0.2, 0.5][pokemon.stars - 1] ?? 0.5) *
            (1 + pokemon.ap / 100))
    )
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.TRUE,
      pokemon,
      crit,
      false
    )
  }
}
