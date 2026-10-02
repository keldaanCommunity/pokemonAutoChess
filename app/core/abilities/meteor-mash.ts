import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class MeteorMashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const nbHits = 3 + (pokemon.status.psychicField ? 1 : 0)
    const damage = Math.round(pokemon.atk * ([100, 120, 140, 200][pokemon.stars - 1] ?? 200) / 100)
    for (let n = 0; n < nbHits; n++) {
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      pokemon.addAttack(2, pokemon, 0, false)
    }
  }
}
