import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class MuddyWaterStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const cells = board.getCellsInFront(pokemon, target)
    const damage = [40, 80, 160, 320][pokemon.stars - 1] ?? 320
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        pokemon.broadcastAbility({ targetX: cell.x, targetY: cell.y })
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerArmorReduction(4000, cell.value)
        cell.value.status.triggerWound(4000, cell.value, pokemon)
      }
    })
  }
}
