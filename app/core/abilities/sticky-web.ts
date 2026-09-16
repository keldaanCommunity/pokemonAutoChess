import { EffectEnum } from "../../types/enum/Effect"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class StickyWebStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 35, 70, 140][pokemon.stars - 1] ?? 140
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    const cells = board.getCellsInFront(pokemon, target, 1)
    cells.forEach((cell) => {
      board.addBoardEffect(
        cell.x,
        cell.y,
        EffectEnum.STICKY_WEB,
        pokemon.simulation
      )
      pokemon.broadcastAbility({ positionX: cell.x, positionY: cell.y })
    })
  }
}
