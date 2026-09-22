import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SacredSwordGrassStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const nbRemainingAllies = board.cells.filter(
      (p) => p && p.team === pokemon.team
    ).length
    const baseDmg = [40, 60, 80, 160][pokemon.stars - 1] ?? 160
    const perAllyDmg = [10, 10, 10, 20][pokemon.stars - 1] ?? 20
    const damage = baseDmg + perAllyDmg * nbRemainingAllies
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
  }
}
