import { AttackType, Team } from "../../types/enum/Game"
import type { Board } from "../board"
import { OnAttackEffect } from "../effects/effect"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

const voltSurgeEffect = new OnAttackEffect(({ pokemon, target, board }) => {
  if (pokemon.count.attackCount % 3 === 0) {
    const nbBounces = 4
    const damage = [10, 20, 30, 60][pokemon.stars - 1] ?? 60
    const closestEnemies = board.getClosestEnemies(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.team === Team.RED_TEAM ? Team.BLUE_TEAM : Team.RED_TEAM
    )

    let previousTg: PokemonEntity = pokemon
    let secondaryTargetHit: PokemonEntity | null = target

    for (let i = 0; i < nbBounces; i++) {
      secondaryTargetHit = closestEnemies[i]
      if (secondaryTargetHit) {
        pokemon.broadcastAbility({
          skill: "LINK_CABLE_link",
          positionX: previousTg.positionX,
          positionY: previousTg.positionY,
          targetX: secondaryTargetHit.positionX,
          targetY: secondaryTargetHit.positionY
        })
        secondaryTargetHit.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          false
        )
        previousTg = secondaryTargetHit
      } else {
        break
      }
    }
  }
})

export class VoltSurgeStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const hpGained = [10, 20, 30, 60][pokemon.stars - 1] ?? 60
    pokemon.addMaxHP(hpGained, pokemon, 1, crit, false)
    pokemon.addSpeed(20, pokemon, 0, false)
    if (pokemon.status.electricField === false) {
      pokemon.status.electricField = true
      pokemon.broadcastAbility({ skill: "SUPERCHARGE" })
    }

    // Add the volt surge effect if it's the first ultimate
    if (pokemon.count.ult === 1) {
      pokemon.effectsSet.add(voltSurgeEffect)
    } else {
      pokemon.cooldown = 0 // no cooldown for subsequent ultimates
    }
  }
}
