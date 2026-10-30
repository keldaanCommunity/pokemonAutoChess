import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class DracoMeteorStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 120, 150, 300][pokemon.stars - 1] ?? 300
    const x = target.positionX
    const y = target.positionY
    pokemon.commands.push(
      new DelayedCommand(() => {
        board.getAdjacentCells(x, y, true).forEach((cell) => {
          if (cell.value && pokemon.team !== cell.value.team) {
            cell.value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        })
        pokemon.addAbilityPower(-20, pokemon, 0, false)
      }, 1000)
    )
  }
}
