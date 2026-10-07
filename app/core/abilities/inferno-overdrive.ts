import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class InfernoOverdriveStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // deals [50,100,150,200,300,SP] SPECIAL to all enemies in a 2-tile radius and inflicts BURN for 5 seconds
    // Damage becomes TRUE if the enemy hit is already BURN

    const damage = [50, 100, 150, 200, 300][pokemon.stars - 1] ?? 300
    pokemon.simulation.commands.push(
      new DelayedCommand(() => {
        board
          .getCellsInRadius(pokemon.targetX, pokemon.targetY, 2, true)
          .forEach((cell) => {
            if (cell.value && cell.value.team !== pokemon.team) {
              const enemy = cell.value
              enemy.handleSpecialDamage(
                damage,
                board,
                enemy.status.burn ? AttackType.TRUE : AttackType.SPECIAL,
                pokemon,
                crit
              )
              enemy.status.triggerBurn(5000, enemy, pokemon)
            }
          })
      }, 500)
    )
  }
}
