import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class MindBendStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Target is Possessed for 2 seconds. If Rune Protect or already possessed, takes 100 special damage instead.
    if (target.status.runeProtect || target.status.possessed) {
      target.handleSpecialDamage([100, 100, 100, 200][pokemon.stars - 1] ?? 200, board, AttackType.SPECIAL, pokemon, crit)
    } else {
      const duration = Math.round(
        ([2000, 2000, 2000, 4000][pokemon.stars - 1] ?? 4000) *
          (1 + pokemon.ap / 100) *
          (crit ? pokemon.critPower : 1)
      )
      target.status.triggerPossessed(duration, target, pokemon)
    }
  }
}
