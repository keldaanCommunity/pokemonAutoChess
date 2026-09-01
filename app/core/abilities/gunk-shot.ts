import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class GunkShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [50, 100, 200, 400][pokemon.stars - 1] ?? 400
    const baseDuration = [2000, 4000, 8000, 16000][pokemon.stars - 1] ?? 16000
    const duration = Math.round(
      baseDuration * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
    )

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerPoison(duration, target, pokemon)
  }
}
