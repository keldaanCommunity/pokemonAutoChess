import { AttackType } from "../../types/enum/Game"
import { max } from "../../utils/number"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class PowderStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const speedFactor = [10, 20, 30, 50][pokemon.stars - 1] ?? 50
    const damage = [10, 20, 30, 50][pokemon.stars - 1] ?? 50

    // Find the enemy with the highest SPEED
    const enemies = board
      .getCellsInRange(
        pokemon.positionX,
        pokemon.positionY,
        pokemon.range,
        false
      )
      .filter((cell) => cell.value && cell.value.team !== pokemon.team)
      .map((cell) => cell.value as PokemonEntity)
      .sort((a, b) => b.speed - a.speed)

    const enemyWithHighestSpeed = enemies[0] ?? target
    if (enemyWithHighestSpeed) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        enemyWithHighestSpeed.positionX,
        enemyWithHighestSpeed.positionY
      )
      for (const cell of cells) {
        pokemon.broadcastAbility({
          positionX: cell.x,
          positionY: cell.y
        })
        if (cell.value) {
          if (cell.value.team !== pokemon.team) {
            // Enemy: take damage and reduce SPEED
            cell.value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
            const speedNerf = max(cell.value.speed)(
              speedFactor *
                (1 + pokemon.ap / 100) *
                (crit ? pokemon.critPower : 1)
            )
            cell.value.addSpeed(-speedNerf, pokemon, 0, false)
            cell.value.commands.push(
              new DelayedCommand(() => {
                cell.value?.addSpeed(speedNerf, pokemon, 0, false)
              }, 5000)
            )
          }
        }
      }
    }
  }
}
