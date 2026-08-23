import { AttackType } from "../../types/enum/Game"
import { OrientationArray, OrientationVector } from "../../utils/orientation"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class FrostBreathStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [35, 70, 140, 280][pokemon.stars - 1] ?? 280

    pokemon.orientation = board.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      target
    )
    const [dx, dy] = OrientationVector[pokemon.orientation]

    const orientations = [
      pokemon.orientation,
      OrientationArray[(OrientationArray.indexOf(pokemon.orientation) + 1) % 8],
      OrientationArray[(OrientationArray.indexOf(pokemon.orientation) + 7) % 8]
    ]

    const cellsHit = [[pokemon.positionX + dx, pokemon.positionY + dy]]
    for (const o of orientations) {
      cellsHit.push([
        pokemon.positionX + dx + OrientationVector[o][0],
        pokemon.positionY + dy + +OrientationVector[o][1]
      ])
    }

    cellsHit.forEach((cell) => {
      const value = board.getEntityOnCell(cell[0], cell[1])
      if (value && value.team !== pokemon.team) {
        value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        if (chance(0.5, pokemon)) {
          value.status.triggerFreeze(2000, value, pokemon)
        }
      }
    })
  }
}
