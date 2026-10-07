import { Ability } from "../../types/enum/Ability"
import { AttackType, PokemonActionState, Team } from "../../types/enum/Game"
import type { Board } from "../board"
import { PeriodicEffect } from "../effects/effect"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class SubzeroSlammerStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)

    /*
    An ice pillar forms beneath the caster, raising their elevation and granting them [25,50,100,150,250] SHIELD. 
    The caster then fires an ice laser that deals [10,20,30,50,,SP] SPECIAL damage every 250 ms, switching targets on KO. 
    The laser persists for up to 4 seconds. 
    After 5 seconds, the laser triggers an ice explosion that deals [15,30,60,100,200,SP] damage to the current target and ADJACENT enemies.
    */

    const shield = [25, 50, 100, 150, 250][pokemon.stars - 1] ?? 0
    const laserDamage = [10, 20, 30, 50, 100][pokemon.stars - 1] ?? 0
    const explosionDamage = [15, 30, 60, 100, 200][pokemon.stars - 1] ?? 0
    const laserMaxHits = 4 * 4
    const laserInterval = 250
    const riseDelay = 800

    pokemon.addShield(shield, pokemon, 0, false)
    pokemon.action = PokemonActionState.IDLE
    pokemon.cooldown = laserMaxHits * laserInterval + riseDelay + 200

    const enemyTeam =
      pokemon.team === Team.BLUE_TEAM ? Team.RED_TEAM : Team.BLUE_TEAM

    let currentTarget =
      target ||
      board.getClosestEnemy(pokemon.positionX, pokemon.positionY, enemyTeam)

    const iceLaserEffect = new PeriodicEffect(
      () => {
        if (iceLaserEffect.count === laserMaxHits) {
          if (currentTarget) {
            pokemon.broadcastAbility({
              skill: "SUBZERO_SLAMMER_EXPLOSION",
              targetX: currentTarget.positionX,
              targetY: currentTarget.positionY
            })
            board
              .getAdjacentCells(
                currentTarget.positionX,
                currentTarget.positionY,
                true
              )
              .forEach((adjacentCell) => {
                if (
                  adjacentCell.value &&
                  adjacentCell.value.team === enemyTeam
                ) {
                  const enemy = adjacentCell.value as PokemonEntity
                  enemy.handleSpecialDamage(
                    explosionDamage,
                    board,
                    AttackType.SPECIAL,
                    pokemon,
                    crit
                  )
                }
              })
          }
          cancelLaser()
          return false
        }

        if (!currentTarget || currentTarget.hp === 0) {
          currentTarget = board.getClosestEnemy(
            pokemon.positionX,
            pokemon.positionY,
            enemyTeam
          )
        }
        if (!currentTarget) {
          cancelLaser()
          return false
        }

        pokemon.broadcastAbility({
          skill: "SUBZERO_SLAMMER_LASER",
          targetX: currentTarget.positionX,
          targetY: currentTarget.positionY
        })
        currentTarget.handleSpecialDamage(
          laserDamage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      },
      Ability.SUBZERO_SLAMMER,
      laserInterval
    )

    pokemon.commands.push(
      new DelayedCommand(
        () => pokemon.effectsSet.add(iceLaserEffect),
        riseDelay
      )
    )

    const cancelLaser = () => {
      pokemon.effectsSet.delete(iceLaserEffect)
      pokemon.toMovingState()
    }
  }
}
