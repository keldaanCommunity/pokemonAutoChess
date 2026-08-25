import { AttackType, Team } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SacredSwordCavernStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const numberOfEnemiesInOurSide = board.cells.filter(
      (cell) =>
        cell &&
        cell.team !== pokemon.team &&
        (pokemon.team === Team.BLUE_TEAM
          ? cell.positionY < 3
          : cell.positionY > 2)
    ).length
    const baseDmg = [40, 60, 80, 160][pokemon.stars - 1] ?? 160
    const perEnemyDmg = [20, 20, 20, 40][pokemon.stars - 1] ?? 40
    const damage = baseDmg + perEnemyDmg * numberOfEnemiesInOurSide
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
  }
}
