import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class LeechSeedStrategy extends AbilityStrategy {
  requiresTarget = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damagePercent = [4, 8, 12, 16][pokemon.stars - 1] ?? 16
    const duration = 5000

    for (let i = 0; i < 5; i++) {
      pokemon.broadcastAbility({
        skill: "LEECH_SEED_PROJECTILE",
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: target.positionX,
        targetY: target.positionY
      })
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.commands.push(
            new DelayedCommand(
              () => {
                pokemon.broadcastAbility({
                  skill: Ability.LEECH_SEED,
                  targetX: target.positionX,
                  targetY: target.positionY
                })
                const result = target.handleSpecialDamage(
                  (damagePercent * target.maxHP) / 100,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit
                )
                if (result.takenDamage) {
                  const lowestHealthAllies = board.cells
                    .filter(
                      (cell): cell is PokemonEntity =>
                        cell != null && cell.team === pokemon.team
                    )
                    // Sort by missing HP (maxHP - current HP)
                    .sort((a, b) => b.maxHP - b.hp - (a.maxHP - a.hp))
                  if (lowestHealthAllies.length > 0) {
                    const lowestHealthAlly = lowestHealthAllies[0]
                    pokemon.broadcastAbility({
                      skill: "LEECH_SEED_HEAL",
                      positionX: target.positionX,
                      positionY: target.positionY,
                      targetX: lowestHealthAlly.positionX,
                      targetY: lowestHealthAlly.positionY
                    })
                    lowestHealthAlly.commands.push(
                      new DelayedCommand(() => {
                        lowestHealthAlly?.handleHeal(
                          result.takenDamage,
                          pokemon,
                          0,
                          crit
                        )
                      }, 1000)
                    )
                  }
                }
              },
              (i * duration) / 5
            )
          )
        }, 600)
      )
    }
  }
}
