import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import { FalinksFormationEffect } from "../effects/passives/falinks-formation"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class NoRetreatStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const nbFalinks =
      [...pokemon.effectsSet.values()].find(
        (e) => e instanceof FalinksFormationEffect
      )?.stacks ?? 0
    if (nbFalinks > 0) {
      //Gain 1 DEF and 1 SPE_DEF per Falinks on your team. Troopers tackle target for [20,20,20,40,SP] SPECIAL each.  
      pokemon.addDefense(nbFalinks, pokemon, 0, false)
      pokemon.addSpecialDefense(nbFalinks, pokemon, 0, false)

      const damage = [20,20,20,40][pokemon.stars - 1] ?? 40
      for (let i = 0; i < nbFalinks; i++) {
        pokemon.commands.push(
          new DelayedCommand(() => {
            target.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }, i * 100)
        )
      }
    }
  }
}
