import { AttackType } from "../../types/enum/Game"
import { Item } from "../../types/enum/Item"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class WoodHammerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const atkMult = [4, 4, 8, 16][pokemon.stars - 1] ?? 16
    const damage = atkMult * pokemon.atk
    const recoil = pokemon.atk

    pokemon.commands.push(
      new DelayedCommand(() => {
        target.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )

        if (pokemon.items.has(Item.PROTECTIVE_PADS) === false) {
          pokemon.handleSpecialDamage(
            recoil,
            board,
            AttackType.PHYSICAL,
            pokemon,
            false,
            false
          )
        }
      }, 500)
    )
  }
}
