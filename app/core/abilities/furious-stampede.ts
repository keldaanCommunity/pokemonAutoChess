import { BOARD_HEIGHT, BOARD_WIDTH } from "../../config/game/board"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class FuriousStampedeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const nbTauros = [8, 12, 16, 20, 24][pokemon.stars - 1] ?? 20
    const damage = [20, 25, 40, 65, 100][pokemon.stars - 1] ?? 100
    const flinchDuration = 3000

    const rows = Array.from({ length: nbTauros }, (_, i) =>
      Math.floor(Math.random() * BOARD_HEIGHT)
    )
    pokemon.broadcastAbility({ data: { rows } })

    for (let i = 0; i < nbTauros; i++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        pokemon.simulation.commands.push(
          new DelayedCommand(
            () => {
              const randomRow = rows[i]
              const enemy = board.getEntityOnCell(x, randomRow)
              if (enemy && enemy.team !== pokemon.team) {
                enemy.status.triggerFlinch(flinchDuration, enemy, pokemon)
                enemy.handleSpecialDamage(
                  damage,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit,
                  false
                )
              }
            },
            1000 + i * 100 + x * 75
          )
        )
      }
    }
  }
}
