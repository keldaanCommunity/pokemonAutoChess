import { AttackType } from "../../types/enum/Game"
import { pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class NeverEndingNightmareStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // A dark aura surrounds the user in a 4-tile radius, inflicting SILENCE for 5 seconds. During that time, 5 phantom hands emerge and strike the enemies in the area dealing [30,60,100,150,200,SP] SPECIAL. Cursed enmies are more likely to be targeted and receive 30% more damage.
    const silenceDuration = 5000
    const damage = [30, 60, 100, 150, 200][pokemon.stars - 1] ?? 200
    const cursedDamageMultiplier = 1.3
    const phantomHandsCount = 5
    const radius = 4

    const enemiesInRange = board
      .getCellsInRadius(pokemon.positionX, pokemon.positionY, radius, false)
      .map((cell) => cell.value)
      .filter<PokemonEntity>(
        (entity): entity is PokemonEntity =>
          entity != null && pokemon.team != entity.team
      )

    const cursedEnemies = enemiesInRange.filter(
      (enemy) =>
        enemy.status.curseFate ||
        enemy.status.curseTorment ||
        enemy.status.curseVulnerability ||
        enemy.status.curseWeakness
    )

    const candidateTargets = [...cursedEnemies, ...enemiesInRange]

    enemiesInRange.forEach((enemy) => {
      enemy.status.triggerSilence(silenceDuration, enemy, pokemon)
    })

    for (let i = 0; i < phantomHandsCount; i++) {
      if (candidateTargets.length === 0) break
      pokemon.simulation.commands.push(
        new DelayedCommand(() => {
          // need to recalculate enemies in range and cursed enemies for each hand strike, as the status effects and positions may have changed
          const enemiesInRange = board
            .getCellsInRadius(
              pokemon.positionX,
              pokemon.positionY,
              radius,
              false
            )
            .map((cell) => cell.value)
            .filter<PokemonEntity>(
              (entity): entity is PokemonEntity =>
                entity != null && pokemon.team != entity.team
            )

          const cursedEnemies = enemiesInRange.filter(
            (enemy) =>
              enemy.status.curseFate ||
              enemy.status.curseTorment ||
              enemy.status.curseVulnerability ||
              enemy.status.curseWeakness
          )

          const candidateTargets = [...cursedEnemies, ...enemiesInRange]

          enemiesInRange.forEach((enemy) => {
            enemy.status.triggerSilence(silenceDuration, enemy, pokemon)
          })

          const target = pickRandomIn(candidateTargets)
          if (target) {
            const isCursed = cursedEnemies.includes(target)
            pokemon.broadcastAbility({
              skill: "NEVER_ENDING_NIGHTMARE_ARM",
              targetX: target.positionX,
              targetY: target.positionY
            })
            target.handleSpecialDamage(
              damage * (isCursed ? cursedDamageMultiplier : 1),
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        }, i * 1000)
      )
    }
  }
}
