import { AbilityConfigs } from "../../config/game/abilities"
import { Ability } from "../../types/enum/Ability"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class NaturalGiftStrategy extends AbilityStrategy {
  readonly config = AbilityConfigs[Ability.NATURAL_GIFT]

  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)

    const lowestHealthAlly = (
      board.cells.filter(
        (cell) => cell && cell.team === pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.hp / a.maxHP - b.hp / b.maxHP)[0]
    const { heal, safeguardDuration } = this.computeConfigWithScaling(pokemon)

    if (lowestHealthAlly) {
      lowestHealthAlly.handleHeal(heal, pokemon, 0, crit)
      lowestHealthAlly.status.triggerRuneProtect(
        safeguardDuration * 1000,
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
