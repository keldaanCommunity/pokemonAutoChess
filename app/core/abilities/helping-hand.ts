import { EffectEnum } from "../../types/enum/Effect"
import { distanceM } from "../../utils/distance"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class HelpingHandStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const nbAlliesBuffed = 2
    const shield = [30, 60, 100, 200][pokemon.stars - 1] ?? 200
    const allies = new Array<{ pkm: PokemonEntity; distance: number }>()
    board.forEach((x, y, cell) => {
      if (cell && cell.team === pokemon.team && pokemon.id !== cell.id) {
        allies.push({
          pkm: cell,
          distance: distanceM(
            pokemon.positionX,
            pokemon.positionY,
            cell.positionX,
            cell.positionY
          )
        })
      }
    })
    allies.sort((a, b) => a.distance - b.distance)
    for (let i = 0; i < nbAlliesBuffed; i++) {
      const ally = allies[i]?.pkm
      if (ally) {
        ally.effects.add(EffectEnum.DOUBLE_DAMAGE)
        ally.addShield(shield, pokemon, 1, crit)
        pokemon.broadcastAbility({
          positionX: ally.positionX,
          positionY: ally.positionY
        })
      }
    }
  }
}
