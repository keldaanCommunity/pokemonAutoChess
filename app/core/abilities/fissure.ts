import { BOARD_HEIGHT, BOARD_WIDTH } from "../../config"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class FissureStrategy extends AbilityStrategy {
  requiresTarget = false

  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [30, 60, 120, 240][pokemon.stars - 1] ?? 240

    let enemies = board
      .getCellsInRadius(pokemon.positionX, pokemon.positionY, 2, false)
      .map((cell) => cell.value)
      .filter(
        (entity): entity is PokemonEntity =>
          entity != null && entity.team !== pokemon.team && entity.hp > 0
      )

    // Keep the search local unless the two-tile radius is empty.
    if (enemies.length === 0) {
      enemies = board.cells.filter(
        (entity): entity is PokemonEntity =>
          entity != null && entity.team !== pokemon.team && entity.hp > 0
      )
    }

    const enemy = enemies.sort((a, b) => {
      if (a.canBeMoved !== b.canBeMoved) {
        return a.canBeMoved ? -1 : 1
      }
      return b.pp - a.pp
    })[0]

    if (!enemy) return

    // Resolve the impact after the projectile's 800 ms travel time.
    pokemon.broadcastAbility({
      skill: "FISSURE_PROJECTILE",
      positionX: pokemon.positionX,
      positionY: pokemon.positionY,
      targetX: enemy.positionX,
      targetY: enemy.positionY
    })

    pokemon.commands.push(
      new DelayedCommand(() => {
        if (enemy.hp <= 0) return

        const isPulling = enemy.range >= 2
        // Red's player board is vertically mirrored relative to the battle board.
        const blueHoleIndex = enemy.positionY * BOARD_WIDTH + enemy.positionX
        const redHoleIndex =
          (BOARD_HEIGHT - 1 - enemy.positionY) * BOARD_WIDTH + enemy.positionX
        const hasFullyDugHole =
          pokemon.simulation.bluePlayer?.groundHoles[blueHoleIndex] === 5 ||
          pokemon.simulation.redPlayer?.groundHoles[redHoleIndex] === 5

        pokemon.broadcastAbility({
          targetX: enemy.positionX,
          targetY: enemy.positionY
        })

        if (enemy.canBeMoved) {
          const orientation = isPulling
            ? board.orientation(
                enemy.positionX,
                enemy.positionY,
                pokemon.positionX,
                pokemon.positionY,
                enemy
              )
            : board.orientation(
                pokemon.positionX,
                pokemon.positionY,
                enemy.positionX,
                enemy.positionY,
                pokemon
              )
          const place = board.getKnockBackPlace(
            enemy.positionX,
            enemy.positionY,
            orientation
          )

          if (place) {
            pokemon.broadcastAbility({
              targetX: place.x,
              targetY: place.y,
              skill: "FISSURE_HIT"
            })
            enemy.moveTo(place.x, place.y, board, false)
          }
        }

        enemy.handleSpecialDamage(
          damage * (hasFullyDugHole ? 2 : 1),
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        enemy.status.triggerLocked(2000, enemy)
      }, 800)
    )
  }
}
