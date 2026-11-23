import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import { Pkm } from "../../types/enum/Pokemon"
import { isOnBench } from "../../utils/board"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SchoolingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const cast = {
      skill: Ability.SCHOOLING,
      positionX: pokemon.positionX,
      positionY: pokemon.positionY,
      orientation: pokemon.orientation,
      ap: Math.round(pokemon.ap * (crit ? pokemon.critPower : 1))
    }
    const targets: { x: number; y: number }[] = []
    const pctDmg = [0.15, 0.15, 0.15, 0.3][pokemon.stars - 1] ?? 0.3
    const damage = pctDmg * pokemon.maxHP

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        targets.push({ x: cell.x, y: cell.y })
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })

    pokemon.broadcastAbility({ ...cast, data: { targets } })

    if (pokemon.player && !pokemon.isGhostOpponent) {
      pokemon.player.board.forEach((ally, id) => {
        if (ally && ally.name === Pkm.WISHIWASHI && isOnBench(ally)) {
          pokemon.addMaxHP(50, pokemon, 0, false, true)
          pokemon.player!.board.delete(id)
        }
      })
    }
  }
}
