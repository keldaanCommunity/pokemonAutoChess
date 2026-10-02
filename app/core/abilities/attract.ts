import { pickNRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class AttractStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const nbTargets = [1, 2, 3, 5][pokemon.stars - 1] ?? 5
    const targets = pickNRandomIn(
      board.cells.filter((v) => v && v.team !== pokemon.team),
      nbTargets
    )
    const charmDuration = 1000
    targets?.forEach((t) => {
      if (t) {
        pokemon.broadcastAbility({
          targetX: t.positionX,
          targetY: t.positionY
        })
        t?.status.triggerCharm(charmDuration, t, pokemon, true)
      }
    })
  }
}
