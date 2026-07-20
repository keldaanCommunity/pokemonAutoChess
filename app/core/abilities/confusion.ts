import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ConfusionStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const confusionDuration = [3000, 5000, 7000, 10000][pokemon.stars - 1] ?? 10000
    const damage = [75, 150, 300, 500][pokemon.stars - 1] ?? 500

    if (target.status.confusion) {
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    } else {
      target.status.triggerSilence(confusionDuration, target, pokemon)
      target.status.triggerConfusion(confusionDuration, target, pokemon)
    }
  }
}
