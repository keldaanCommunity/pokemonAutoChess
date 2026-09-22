import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class NaturalGiftStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)

    const lowestHealthAlly = (
      board.cells.filter(
        (cell) => cell && cell.team === pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.hp / a.maxHP - b.hp / b.maxHP)[0]
    const heal = [30, 60, 90, 150][pokemon.stars - 1] ?? 150

    if (lowestHealthAlly) {
      lowestHealthAlly.handleHeal(heal, pokemon, 1, crit)
      const runeProtectDuration = [1000,2000,3000,6000][pokemon.stars - 1] ?? 6000
      lowestHealthAlly.status.triggerRuneProtect(
        runeProtectDuration,
        lowestHealthAlly,
        pokemon
      )
      pokemon.broadcastAbility({
        targetX: lowestHealthAlly.positionX,
        targetY: lowestHealthAlly.positionY
      })
    }
  }
}
