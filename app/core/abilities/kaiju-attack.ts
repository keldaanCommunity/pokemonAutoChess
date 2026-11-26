import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class KaijuAttackStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Gain [100,100,100,120,150,SP]% additional base max HP and lets out a terrifying howl that causes all ennemies FLINCH for 4 seconds.
    // Then target the enemy with the highest max HP and hurls a huge rock that deals [100,200,300,400,800,SP] SPECIAL to it and ADJACENT enemies.
    const hpGain = [100, 100, 100, 120, 150][pokemon.stars - 1] ?? 150
    const flinchDuration = 4
    const damage = [100, 200, 300, 400, 800][pokemon.stars - 1] ?? 800

    pokemon.addMaxHP(
      Math.round(pokemon.baseHP * (hpGain / 100)),
      pokemon,
      1,
      crit
    )
    const enemies: PokemonEntity[] = []

    board.cells.forEach((p) => {
      if (p && p.team !== pokemon.team) {
        p.status.triggerFlinch(flinchDuration * 1000, p, pokemon)
        enemies.push(p)
      }
    })

    pokemon.commands.push(
      new DelayedCommand(() => {
        const highestHPEnemy = enemies.reduce((prev, curr) => {
          return prev.baseHP > curr.baseHP ? prev : curr
        })

        if (highestHPEnemy) {
          pokemon.broadcastAbility({
            targetX: highestHPEnemy.positionX,
            targetY: highestHPEnemy.positionY,
            skill: "KAIJU_ATTACK_PROJECTILE"
          })
          pokemon.simulation.commands.push(
            new DelayedCommand(() => {
              const enemiesHit: PokemonEntity[] = board
                .getAdjacentCells(
                  highestHPEnemy.positionX,
                  highestHPEnemy.positionY,
                  true
                )
                .filter(
                  (cell) => cell.value && cell.value.team !== pokemon.team
                )
                .map((cell) => cell.value!)

              for (const enemy of enemiesHit) {
                enemy.handleSpecialDamage(
                  damage,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit
                )
              }
            }, 500)
          )
        }
      }, 1000)
    )
  }
}
