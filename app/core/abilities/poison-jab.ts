import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class PoisonJabStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const damage = [30, 60, 120, 240][pokemon.stars - 1] ?? 240
    super.process(pokemon, board, target, crit)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerPoison(3000, target, pokemon)
    pokemon.status.triggerPoison(3000, pokemon, pokemon)
    pokemon.moveTo(target.positionX, target.positionY, board, true)
  }
}
