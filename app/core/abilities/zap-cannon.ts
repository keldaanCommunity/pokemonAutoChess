import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ZapCannonStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [25, 50, 100, 200][pokemon.stars - 1] ?? 200
    const duration = [1000, 2000, 4000, 8000][pokemon.stars - 1] ?? 8000
    target.status.triggerArmorReduction(duration, target)
    target.status.triggerParalysis(duration, target, pokemon)
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}
