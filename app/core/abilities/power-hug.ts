import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class PowerHugStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [40, 80, 160, 320][pokemon.stars - 1] ?? 320
    target.status.triggerLocked([3000, 3000, 6000, 10000][pokemon.stars - 1] ?? 10000, target)
    target.status.triggerParalysis([3000, 3000, 6000, 10000][pokemon.stars - 1] ?? 10000, target, pokemon)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}
