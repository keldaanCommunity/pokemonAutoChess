import { AttackType } from "../../types/enum/Game"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class TwineedleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Deals [25,50,160,80,SP] SPECIAL to the target twice. The first hit can crit by default, and the second hit has [50,LK]% chance to apply POISONNED for 4 seconds.
    const damage = [25, 50, 80, 160][pokemon.stars - 1] ?? 160
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      chance(pokemon.critChance / 100, pokemon)
    )
    pokemon.commands.push(
      new DelayedCommand(() => {
        target.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        if (chance(0.5, pokemon)) {
          target.status.triggerPoison(4000, target, pokemon)
        }
      }, 500)
    )
  }
}
