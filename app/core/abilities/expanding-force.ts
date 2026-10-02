import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import { distanceM } from "../../utils/distance"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ExpandingForceStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    // User gains PSYCHIC_FIELD, or spreads it to a nearby ally.
    if (!pokemon.status.psychicField) {
      pokemon.status.addPsychicField(pokemon)
    } else {
      // Find nearby ally without PSYCHIC_FIELD and give it to them
      const nearbyAllies = board.cells
        .filter(
          (ally): ally is PokemonEntity =>
            !!ally && ally.team === pokemon.team && !ally.status.psychicField
        )
        .sort(
          (a, b) =>
            distanceM(
              a.positionX,
              a.positionY,
              pokemon.positionX,
              pokemon.positionY
            ) -
            distanceM(
              b.positionX,
              b.positionY,
              pokemon.positionX,
              pokemon.positionY
            )
        )

      if (nearbyAllies.length > 0) {
        const chosen = nearbyAllies[0]
        chosen.status.addPsychicField(chosen)
      }
    }

    // All allies in a PSYCHIC_FIELD: deal [10,20,40,80,SP] SPECIAL to adjacent enemies
    const damage = [10, 20, 40, 80][pokemon.stars - 1] ?? 80
    board.cells
      .filter(
        (ally): ally is PokemonEntity =>
          !!ally && ally.team === pokemon.team && ally.status.psychicField
      )
      .forEach((ally) => {
        ally.broadcastAbility({ skill: Ability.EXPANDING_FORCE })
        board
          .getAdjacentCells(ally.positionX, ally.positionY)
          .forEach((cell) => {
            if (cell.value && cell.value.team !== pokemon.team) {
              cell.value.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
            }
          })
      })
  }
}
