import { distanceM } from "../../utils/distance"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class MoonDreamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const duration =
      ([3000, 6000, 9000, 18000][pokemon.stars - 1] ?? 18000)

    const shield = [10, 20, 30, 60][pokemon.stars - 1] ?? 60
    const count = 3

    const allies = board.cells.filter(
      (p) => p && p.team === pokemon.team && p.id !== pokemon.id
    ) as PokemonEntity[]
    const alliesHit = allies
      .sort(
        (a, b) =>
          distanceM(
            a.positionX,
            a.positionY,
            pokemon.targetX,
            pokemon.targetY
          ) -
          distanceM(b.positionX, b.positionY, pokemon.targetX, pokemon.targetY)
      )
      .slice(0, count)

    alliesHit.forEach((ally) => {
      ally.addShield(shield, pokemon, 1, crit)
      pokemon.broadcastAbility({
        positionX: ally.positionX,
        positionY: ally.positionY
      })
    })

    target.status.triggerSleep(duration, target)
  }
}
