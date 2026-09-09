import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class EerieSpellStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const damage = [10, 20, 40, 80][pokemon.stars - 1] ?? 80
    const healAmount = [15, 30, 45, 90][pokemon.stars - 1] ?? 90
    const visited = new Set<string>()
    let currentTarget: PokemonEntity | undefined = target
    let lastTarget: PokemonEntity = pokemon

    // Queue 4 bounces with 300ms delays
    for (let i = 0; i < 4; i++) {
      if (currentTarget) {
        visited.add(currentTarget.id)

        // Animate wave from last position to current target
        pokemon.broadcastAbility({
          positionX: lastTarget.positionX,
          positionY: lastTarget.positionY,
          targetX: currentTarget.positionX,
          targetY: currentTarget.positionY,
          delay: 300 * i
        })

        lastTarget = currentTarget

        // Heal allies, damage enemies
        if (currentTarget.team === pokemon.team) {
          currentTarget.handleHeal(healAmount, pokemon, 1, crit)
        } else {
          currentTarget.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      }

      // Find next target with lowest HP
      currentTarget = board.cells
        .filter((c): c is PokemonEntity => c != null && !visited.has(c.id))
        .sort((a, b) => a.hp - b.hp)[0]
    }
  }
}
