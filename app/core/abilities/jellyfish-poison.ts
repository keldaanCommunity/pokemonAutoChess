import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class JellyfishPoisonStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const baseDuration = 3000
    const duration = Math.round(
      baseDuration * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
    )
    // Sends 3 poisonous waves in a CONE. Each enemy hit receives one effect based on its current status: if it isn't POISONED, inflicts POISONED for [3,SP] seconds. If it is POISONED, inflicts ARMOR_BREAK for [3,SP] seconds. If it already has ARMOR_BREAK, inflicts FATIGUE for [3,SP] seconds. If it already has FATIGUE, inflicts SILENCE for [3,SP] seconds.
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

            if (enemy.status.poisonStacks === 0) {
              enemy.status.triggerPoison(duration, enemy, pokemon)
            } else if (!enemy.status.armorReduction) {
              enemy.status.triggerArmorReduction(duration, enemy)
            } else if (!enemy.status.fatigue) {
              enemy.status.triggerFatigue(duration, enemy, pokemon, false)
            } else if (!enemy.status.silence) {
              enemy.status.triggerSilence(duration, enemy, pokemon)
            }
          }
        }, 1000 * i)
      )
    }
  }
}
