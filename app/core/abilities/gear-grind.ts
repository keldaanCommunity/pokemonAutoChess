import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class GearGrindStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    // Launches two gears at the target, each dealing [25,50,100,200,SP]% of SPEED as SPECIAL
    super.process(pokemon, board, target, crit)
    const speedFactor = [0.25, 0.5, 1, 2][pokemon.stars - 1] ?? 2
    const damage = Math.round(pokemon.speed * speedFactor)
    for (let i = 0; i < 2; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          target.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }, i * 250)
      )
    }
  }
}
