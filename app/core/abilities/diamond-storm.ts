import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class DiamondStormStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damageFactor = [1, 1, 1.5, 3][pokemon.stars - 1] ?? 3
    const damage = pokemon.def * damageFactor
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    const targets = cells
      .filter((cell) => cell.value && cell.value.team !== pokemon.team)
      .map(({ x, y }) => ({ x, y }))
    pokemon.broadcastAbility({
      ap: Math.round(pokemon.ap * (crit ? pokemon.critPower : 1)),
      data: { targets }
    })
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}
