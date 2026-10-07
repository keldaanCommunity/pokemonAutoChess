import { BOARD_HEIGHT, BOARD_WIDTH } from "../../config/game/board"
import {
  FOSSIL_ATK_BUFF_PER_SYNERGY_TIER,
  FOSSIL_SHIELD_PER_SYNERGY_TIER,
  SynergyTiers
} from "../../config/game/synergies"
import { AttackType } from "../../types/enum/Game"
import { Synergy } from "../../types/enum/Synergy"
import { distanceC } from "../../utils/distance"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class PalaeoCollapseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    /*
    A meteorite slams into the board, targeting the biggest cluster of enemies. It deals [100,200,300,400,800,SP] SPECIAL to all enemies in a 3-tile radius with 20% DAMAGE_REDUCTION_OVER_DISTANCE.
     All FOSSIL allies in the impact zone trigger their FOSSIL primordial power immediately if not already triggered.
    */
    const damage = [100, 200, 300, 400, 800][pokemon.stars - 1] ?? 800
    const radius = 3
    const damageReductionOverDistance = 0.2
    let maxEnemyCount = 0
    let bestCell: { x: number; y: number } = {
      x: BOARD_WIDTH / 2,
      y: BOARD_HEIGHT / 2
    }
    board.forEach((x: number, y: number) => {
      const adjacentCells = board.getAdjacentCells(x, y, true)
      const adjacentEnemies = adjacentCells.filter(
        (cell) => cell.value && cell.value.team !== pokemon.team
      )
      if (adjacentEnemies.length > maxEnemyCount) {
        maxEnemyCount = adjacentEnemies.length
        bestCell = { x, y }
      }
    })
    if (bestCell) {
      pokemon.broadcastAbility({
        targetX: bestCell.x,
        targetY: bestCell.y
      })
      pokemon.simulation.commands.push(
        new DelayedCommand(() => {
          const unitsInRadius = board.getCellsInRadius(
            bestCell.x,
            bestCell.y,
            radius,
            true
          )
          const enemiesHit = unitsInRadius
            .filter((cell) => cell.value && cell.value.team !== pokemon.team)
            .map((cell) => cell.value as PokemonEntity)
          for (const enemy of enemiesHit) {
            const distance = distanceC(
              bestCell.x,
              bestCell.y,
              enemy.positionX,
              enemy.positionY
            )
            const damageMultiplier = 1 - damageReductionOverDistance * distance
            const finalDamage = Math.round(damage * damageMultiplier)
            enemy.handleSpecialDamage(
              finalDamage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }

          const fossilAlliesInRadius = unitsInRadius
            .filter(
              (cell) =>
                cell.value &&
                cell.value.team === pokemon.team &&
                cell.value.hasSynergy(Synergy.FOSSIL)
            )
            .map((cell) => cell.value as PokemonEntity)
          for (const ally of fossilAlliesInRadius) {
            if (ally.hasSynergyEffect(Synergy.FOSSIL)) {
              const synergyTier = SynergyTiers[Synergy.FOSSIL].findIndex(
                (effect) => ally.effects.has(effect)
              )
              const shield = Math.round(
                ally.maxHP * (FOSSIL_SHIELD_PER_SYNERGY_TIER[synergyTier] ?? 1)
              )
              const attackBonus =
                FOSSIL_ATK_BUFF_PER_SYNERGY_TIER[synergyTier] ?? 1
              ally.addShield(shield, ally, 0, false)
              ally.addAttack(pokemon.baseAtk * attackBonus, ally, 0, false)
              ally.resetCooldown(500)
              ally.broadcastAbility({ skill: "FOSSIL_RESURRECT" })
              SynergyTiers[Synergy.FOSSIL].forEach((e) => {
                ally.effects.delete(e)
              })
            }
          }
        }, 500)
      )
    }
  }
}
