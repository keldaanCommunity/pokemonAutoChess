import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class MudShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // The user hurls mud at the target, dealing 25/50/100 damage and reducing their attack speed by 10/20/30/40%.
    const damage = [25, 50, 100, 200][pokemon.stars - 1] ?? 200
    const speedDebuff = [10, 20, 30, 40][pokemon.stars - 1] ?? 40
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.addSpeed(-speedDebuff, pokemon, 1, crit)
  }
}
