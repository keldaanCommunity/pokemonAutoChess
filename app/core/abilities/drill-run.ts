import { AttackType } from "../../types/enum/Game"
import { OrientationVector } from "../../utils/orientation"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class DrillRunStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [15, 30, 60, 120][pokemon.stars - 1] ?? 120

    pokemon.orientation = board.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      target
    )
    const [dx, dy] = OrientationVector[pokemon.orientation]

    const nextX = target.positionX + dx
    const nextY = target.positionY + dy

    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
    pokemon.moveTo(target.positionX, target.positionY, board, false)

    if (board.isOnBoard(nextX, nextY)) {
      const nextEntity = board.getEntityOnCell(nextX, nextY)
      if (nextEntity?.team === target.team) {
        pokemon.targetX = nextX
        pokemon.targetY = nextY
        pokemon.targetEntityId = nextEntity.id
        pokemon.pp = pokemon.maxPP
      }
    }
  }
}
