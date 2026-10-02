import { AttackType } from "../../types/enum/Game"
import { distanceC } from "../../utils/distance"
import type { Board } from "../board"
import { OnAttackReceivedEffect } from "../effects/effect"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class LingeringAromaStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // For the next 5 seconds, every melee attack received by the user makes the attacker receive [10,20,SP] special damage (scales with AP) and lose 5 PP
    const duration = 5000
    const damage = [10, 20, 30, 60][pokemon.stars - 1] ?? 60
    const lingeringAromaEffect = new OnAttackReceivedEffect(
      ({ attacker, pokemon }) => {
        if (
          distanceC(
            attacker.positionX,
            attacker.positionY,
            pokemon.positionX,
            pokemon.positionY
          ) === 1
        ) {
          // Deal special damage to the attacker
          attacker.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit,
            true
          )
          // Reduce attacker's PP by 5
          attacker.addPP(-5, pokemon, 0, false)
        }
      }
    )

    pokemon.effectsSet.add(lingeringAromaEffect)
    // Remove the effect after the duration
    pokemon.commands.push(
      new DelayedCommand(() => {
        pokemon.effectsSet.delete(lingeringAromaEffect)
      }, duration)
    )
  }
}
