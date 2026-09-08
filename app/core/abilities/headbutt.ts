import { AttackType } from "../../types/enum/Game"
import { Passive } from "../../types/enum/Passive"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class HeadbuttStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage = [20, 40, 80, 160][pokemon.stars - 1] ?? 160
    if (pokemon.passive === Passive.EISCUE_ICE_FACE) {
      damage += pokemon.shield
      pokemon.addShield(-pokemon.shield, pokemon, 0, false)
    }
    if (target.shield > 0) {
      damage *= 2
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerFlinch(5000, target, pokemon)
  }
}
