import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import { chance } from "../../utils/random"
import { type Board, effectInLine } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class AuroraBeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const positionX = pokemon.positionX
    const positionY = pokemon.positionY
    const orientation = pokemon.orientation
    const targetX = target.positionX
    const targetY = target.positionY
    const ap = Math.round(pokemon.ap * (crit ? pokemon.critPower : 1))
    const targets: { x: number; y: number }[] = []

    super.process(pokemon, board, target, crit, true)
    const damage = [25, 50, 100, 200][pokemon.stars - 1] ?? 200
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        const freezeChance = 0.5
        if (chance(freezeChance, pokemon)) {
          cell.value.status.triggerFreeze(2000, cell.value, pokemon)
        }
        targets.push({ x: cell.x, y: cell.y })
      }
    })
    pokemon.broadcastAbility({
      skill: Ability.AURORA_BEAM,
      positionX,
      positionY,
      orientation,
      targetX,
      targetY,
      ap,
      data: { targets }
    })
  }
}
