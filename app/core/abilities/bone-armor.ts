import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class BoneArmorStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const lowestHealthEnemy = (
      board.cells.filter(
        (cell) => cell && cell.team !== pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.hp / a.maxHP - b.hp / b.maxHP)[0]

    if (lowestHealthEnemy) {
      const coord = pokemon.simulation.getClosestFreeCellToPokemonEntity(
        lowestHealthEnemy,
        (lowestHealthEnemy.team + 1) % 2
      )
      if (coord) {
        pokemon.moveTo(coord.x, coord.y, board, false)
      }
      const damage = [20, 40, 80, 160][pokemon.stars - 1] ?? 160
      const defBuff = [4, 8, 12, 24][pokemon.stars - 1] ?? 24
      const attack = lowestHealthEnemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      if (attack.takenDamage > 0) {
        pokemon.handleHeal(attack.takenDamage, pokemon, 0, false)
      }
      if (attack.death) {
        pokemon.addDefense(defBuff, pokemon, 0, false)
        pokemon.addSpecialDefense(defBuff, pokemon, 0, false)
      }
    }
  }
}
