import { AttackType, Team } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class BarbBarrageStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [15, 30, 45, 60, 120][pokemon.stars - 1] ?? 120
    const opponentTeam =
      pokemon.team === Team.BLUE_TEAM ? Team.RED_TEAM : Team.BLUE_TEAM
    const mostSurroundedCoordinate =
      pokemon.state.getMostSurroundedCoordinateAvailablePlace(
        opponentTeam,
        board
      )

    let enemiesHit: PokemonEntity[] = []
    if (mostSurroundedCoordinate) {
      pokemon.moveTo(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y,
        board,
        false
      )

      enemiesHit = board
        .getAdjacentCells(
          mostSurroundedCoordinate.x,
          mostSurroundedCoordinate.y
        )
        .map((v) => v.value)
        .filter(
          (e): e is PokemonEntity => e != null && e?.team !== pokemon.team
        )
    }

    if (enemiesHit.length === 0) {
      enemiesHit.push(target) // ensure to at least hit current target
    }
    enemiesHit.forEach((v) => {
      v.status.triggerPoison(3000, v, pokemon)
      v.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
      pokemon.broadcastAbility({
        targetX: v.positionX,
        targetY: v.positionY,
        orientation: v.orientation
      })
    })
  }
}
