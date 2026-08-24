import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class TripleDiveStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)

    const damage = [15, 30, 60, 120][pokemon.stars - 1] ?? 120

    // Find 3 lowest HP enemies
    const enemies = board.cells
      .filter(
        (entity): entity is PokemonEntity =>
          entity != null && entity.team !== pokemon.team
      )
      .sort((a, b) => a.hp - b.hp)
      .slice(0, 3)

    // Perform triple dive with 400ms delays
    enemies.forEach((enemy, i) => {
      pokemon.commands.push(
        new DelayedCommand(() => {
          if (enemy) {
            const availableAdjacentPlace = board.getClosestAvailablePlace(
              enemy.positionX,
              enemy.positionY
            )

            if (availableAdjacentPlace) {
              pokemon.moveTo(
                availableAdjacentPlace.x,
                availableAdjacentPlace.y,
                board,
                false
              )
            }

            pokemon.broadcastAbility({
              positionX: pokemon.positionX,
              positionY: pokemon.positionY,
              targetX: enemy.positionX,
              targetY: enemy.positionY
            })

            enemy.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        }, 400 * i)
      )
    })
  }
}
