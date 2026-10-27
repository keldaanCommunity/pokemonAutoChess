import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class StingingToxinsStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [1, 2, 3, 4][pokemon.stars - 1] ?? 4
    const baseDuration = 1500
    const duration = Math.round(
      baseDuration * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
    )
    for (let i = 0; i < 3; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          const coneCells = board.getCellsInFront(pokemon, target, 1)

          for (const cell of coneCells) {
            pokemon.broadcastAbility({
              targetX: cell.x,
              targetY: cell.y,
              positionX: pokemon.positionX,
              positionY: pokemon.positionY
            })

            const enemy = cell.value
            if (!enemy || enemy.team === pokemon.team) continue

            enemy.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )

            if (enemy.status.poisonStacks === 0) {
              enemy.status.triggerPoison(duration, enemy, pokemon)
            } else if (!enemy.status.paralysis) {
              enemy.status.triggerParalysis(duration, enemy, pokemon)
            } else if (!enemy.status.armorReduction) {
              enemy.status.triggerArmorReduction(duration, enemy)
            } else if (!enemy.status.fatigue) {
              enemy.status.triggerFatigue(duration, enemy, pokemon, false)
            }
          }
        }, 1000 * i)
      )
    }
  }
}
