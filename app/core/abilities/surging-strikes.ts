import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class SurgingStrikesStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    // strikes the target with a flowing motion three times in a row, dealing [100,SP]% of ATK each as SPECIAL. Always deal critical hits.
    super.process(pokemon, board, target, true)
    const damage = pokemon.atk * ([1, 1, 1, 2][pokemon.stars - 1] ?? 2)
    const nbHits = 3
    for (let i = 0; i < nbHits; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          target.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            true
          )
        }, i * 200)
      )
    }
    pokemon.cooldown += 200 * nbHits
  }
}
