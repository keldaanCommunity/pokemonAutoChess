import { Ability } from "../../types/enum/Ability"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SpiteStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const ppDrain = [20, 40, 60, 100][pokemon.stars - 1] ?? 100

    pokemon.broadcastAbility({
      targetX: target.positionX,
      targetY: target.positionY,
      skill: Ability.PSYCHIC_FANGS
    })

    // Drain PP from target
    target.addPP(-ppDrain, pokemon, 1, crit) //addPP handles pp underflow, ap, crit

    const adjacentAllies = board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .filter((cell) => cell.value && cell.value.team === pokemon.team)
      .map((cell) => cell.value)

    // Redistribute PP to adjacent allies
    if (adjacentAllies.length > 0) {
      for (const ally of adjacentAllies) {
        if (ally) {
          pokemon.broadcastAbility({
            targetX: ally.positionX,
            targetY: ally.positionY
          })
          ally.addPP(ppDrain / adjacentAllies.length, pokemon, 1, crit) //divide by number of allies to redistribute
        }
      }
    }
  }
}
