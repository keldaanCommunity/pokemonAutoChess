import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class BlazeKickStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage = [30, 60, 120, 240][pokemon.stars - 1] ?? 240
    if (target.status.burn) {
      damage = Math.round(damage * 1.3)
    }
    target.status.triggerBurn(2000, target, pokemon)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}
