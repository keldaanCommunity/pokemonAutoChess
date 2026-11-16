import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class BoltBeakStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 40, 80, 160][pokemon.stars - 1] ?? 160
    pokemon.commands.push(
      new DelayedCommand(() => {
        if (target && target.hp > 0) {
          target.handleSpecialDamage(
            target.pp > 40 ? damage * 2 : damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      }, 250)
    )
  }
}
