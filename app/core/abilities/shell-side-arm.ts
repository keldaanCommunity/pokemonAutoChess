import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ShellSideArmStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const poisonDuration =
      ([2000, 3000, 4000, 6000][pokemon.stars - 1] ?? 6000) *
      (1 + pokemon.ap / 100) *
      (crit ? pokemon.critPower : 1)

    const apBoost = [10, 20, 30, 50][pokemon.stars - 1] ?? 50
    const visited = new Set<string>()
    let currentTarget: PokemonEntity | undefined = target
    let lastTarget: PokemonEntity = pokemon

    // Queue 4 bounces with 300ms delays, prioritizing high HP targets
    for (let i = 0; i < 4; i++) {
      if (currentTarget) {
        visited.add(currentTarget.id)

        // Animate wave from last position to current target
        pokemon.broadcastAbility({
          positionX: lastTarget.positionX,
          positionY: lastTarget.positionY,
          targetX: currentTarget.positionX,
          targetY: currentTarget.positionY,
          delay: 300 * i,
          orientation: lastTarget.orientation
        })

        lastTarget = currentTarget

        // Poison enemies, boost allies' AP
        if (currentTarget.team === pokemon.team) {
          currentTarget.addAbilityPower(apBoost, pokemon, 0, false)
        } else {
          currentTarget.status.triggerPoison(
            poisonDuration,
            currentTarget,
            pokemon
          )
        }
      }

      // Find next target with highest HP
      currentTarget = board.cells
        .filter((c): c is PokemonEntity => c != null && !visited.has(c.id))
        .sort((a, b) => b.hp - a.hp)[0]
    }
  }
}
