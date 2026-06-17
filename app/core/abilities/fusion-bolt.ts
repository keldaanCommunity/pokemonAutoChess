import { AttackType } from "../../types/enum/Game"
import { Synergy } from "../../types/enum/Synergy"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class FusionBoltStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const electricLevel = pokemon.player?.synergies.get(Synergy.ELECTRIC)
    const damage = ([30,40,50,100][pokemon.stars - 1] ?? 100) + (electricLevel ?? 0) * ([10,10,10,20][pokemon.stars - 1] ?? 20)
    pokemon.commands.push(
      new DelayedCommand(() => {
        const cells = board.getAdjacentCells(
          target.positionX,
          target.positionY,
          true
        )
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
      }, 250)
    )
  }
}
