import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"
import { DarkAuraCooldownCommand } from "./dark-aura-cooldown"

export class DarkAuraStrategy extends AbilityStrategy {
  requiresTarget = false

  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    pokemon.commands.push(new DarkAuraCooldownCommand())
    super.process(pokemon, board, target, crit)
    let totalDamage = 0
    const damage = 10 + 0.5 * pokemon.atk
    board
      .getCellsInRadius(pokemon.positionX, pokemon.positionY, 2, false)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          totalDamage += cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          ).takenDamage
        }
      })
    pokemon.handleHeal(15 + Math.round(totalDamage * 0.75), pokemon, 0, false)
  }
}
