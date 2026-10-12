import { AttackType } from "../../types/enum/Game"
import { min } from "../../utils/number"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class HornLeechStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = ([2, 2, 3, 5][pokemon.stars - 1] ?? 5) * pokemon.atk
    const { takenDamage } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    // heal for 50% of the damage dealt
    const heal = Math.round(takenDamage * 0.5)
    const overheal = min(0)(heal - (pokemon.maxHP - pokemon.hp))
    pokemon.handleHeal(heal, pokemon, 0, false)
    if (overheal > 0) {
      pokemon.addShield(Math.round(overheal * 0.5), pokemon, 0, false)
    }
  }
}
