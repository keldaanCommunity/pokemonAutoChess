import { AttackType } from "../../types/enum/Game"
import { Passive } from "../../types/enum/Passive"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class IvyCudgelStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [50, 75, 100, 200][pokemon.stars - 1] ?? 200
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    if (pokemon.passive === Passive.OGERPON_TEAL) {
      const nbAdjacentEnemies = board
        .getAdjacentCells(pokemon.positionX, pokemon.positionY, true)
        .filter((cell) => cell.value && cell.value.team !== pokemon.team).length
      pokemon.addAttack(6 * nbAdjacentEnemies, pokemon, 1, crit)
    } else if (pokemon.passive === Passive.OGERPON_WELLSPRING) {
      board
        .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
        .forEach((cell) => {
          if (cell.value && cell.value.team === pokemon.team) {
            cell.value.addPP(25, pokemon, 1, crit)
            cell.value.handleHeal(50, pokemon, 1, crit)
          }
        })
    } else if (pokemon.passive === Passive.OGERPON_HEARTHFLAME) {
      board
        .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
        .forEach((cell) => {
          if (cell.value && cell.value.team !== pokemon.team) {
            cell.value.handleSpecialDamage(
              30,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
            cell.value.status.triggerBurn(5000, pokemon, cell.value)
          }
        })
    } else if (pokemon.passive === Passive.OGERPON_CORNERSTONE) {
      board
        .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
        .forEach((cell) => {
          if (cell.value && cell.value.team !== pokemon.team) {
            cell.value.status.triggerFlinch(5000, pokemon, cell.value)
          }
        })
      const factor = 0.5
      const protectDuration = Math.round(
        2000 *
          (1 + (pokemon.ap / 100) * factor) *
          (crit ? 1 + (pokemon.critPower - 1) * factor : 1)
      )
      pokemon.status.triggerProtect(protectDuration)
    }
  }
}
