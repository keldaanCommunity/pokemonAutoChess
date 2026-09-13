import { EffectEnum } from "../../types/enum/Effect"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class TeleportStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, false) // crit is handled with TELEPORT_NEXT_ATTACK effect
    const safeCell = board.getFlyAwayCell(pokemon)
    if (safeCell) {
      pokemon.moveTo(safeCell.x, safeCell.y, board, false)
      pokemon.effects.add(EffectEnum.TELEPORT_NEXT_ATTACK)
    }
  }
}
