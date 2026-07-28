import { AttackType } from "../../types/enum/Game"
import { distanceM } from "../../utils/distance"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class PetalDanceStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)

    const damage = [20, 30, 50, 100][pokemon.stars - 1] ?? 100
    const count = [3, 4, 5, 6][pokemon.stars - 1] ?? 6

    const enemies = board.cells
      .filter((p): p is PokemonEntity => p != null && p.team !== pokemon.team)
      .map((entity) => ({
        entity,
        distance: distanceM(
          entity.positionX,
          entity.positionY,
          pokemon.positionX,
          pokemon.positionY
        )
      }))
      .sort((a, b) => a.distance - b.distance)

    const projectileSpeed = 10

    for (let i = 0; i < count; i++) {
      const { entity: enemy, distance } = enemies[i % enemies.length]
      pokemon.commands.push(
        new DelayedCommand(() => {
          if (enemy.hp > 0) {
            enemy.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        }, i * 100 + (distance * 1000 / projectileSpeed))
      )

      pokemon.broadcastAbility({
        skill: "PETAL_DANCE_PROJECTILE",
        targetX: enemy.positionX,
        targetY: enemy.positionY,
        delay: i * 100
      })
    }
  }
}
