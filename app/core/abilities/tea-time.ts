import { Berries } from "../../types/enum/Item"
import { schemaValues } from "../../utils/schemas"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class TeaTimeStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const heal = [15, 30, 60, 120][pokemon.stars - 1] ?? 120
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team == tg.team) {
        pokemon.broadcastAbility({ positionX: x, positionY: y })
        tg.handleHeal(heal, pokemon, 1, crit)
        const berry = schemaValues(tg.items).find((item) =>
          Berries.includes(item)
        )
        if (berry) {
          tg.eatBerry(berry)
        }
      }
    })
  }
}
