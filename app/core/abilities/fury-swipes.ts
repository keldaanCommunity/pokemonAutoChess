import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class FurySwipesStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const scale = 1 + pokemon.ap / 100
    const nbAttacks = Math.round(([5,5,5,10][pokemon.stars - 1] ?? 10) * scale)
    const hitPerSecond = Math.round(1000 / nbAttacks)

    for (let n = 0; n < nbAttacks; n++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          if (target && target.hp > 0) {
            target.handleSpecialDamage(
              Math.ceil(pokemon.atk),
              board,
              AttackType.PHYSICAL,
              pokemon,
              crit,
              false
            )
          } else {
            pokemon.addPP(20, pokemon, 0, false) // regain 20 PP per remaining hit
          }
        }, n * hitPerSecond)
      )
    }

    pokemon.cooldown += 1000
  }
}
