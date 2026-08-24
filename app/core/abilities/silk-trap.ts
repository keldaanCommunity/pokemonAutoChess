import { distanceC } from "../../utils/distance"
import type { Board } from "../board"
import { OnAttackReceivedEffect } from "../effects/effect"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class SilkTrapStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // The user spins a silken trap, gaining PROTECT for 1.5 seconds. Any melee attack received during that time will lower the SPEED of the attacker by [5,10,15,SP] and inflict PARALYSIS for [1.5,SP,ND=1] seconds
    const speedNerf = [5, 10, 15, 30][pokemon.stars - 1] ?? 30
    const trapEffect = new OnAttackReceivedEffect(({ attacker, pokemon }) => {
      if (
        distanceC(
          attacker.positionX,
          attacker.positionY,
          pokemon.positionX,
          pokemon.positionY
        ) === 1
      ) {
        attacker.addSpeed(-speedNerf, pokemon, 1, crit)
        attacker.status.triggerParalysis(1500, attacker, pokemon)
      }
    })
    pokemon.status.triggerProtect(1500)
    pokemon.effectsSet.add(trapEffect)
    pokemon.commands.push(
      new DelayedCommand(() => {
        pokemon.effectsSet.delete(trapEffect)
      }, 1500)
    )
  }
}
