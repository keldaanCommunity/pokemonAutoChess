import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class BlizzardStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const positionX = pokemon.positionX
    const positionY = pokemon.positionY
    const orientation = pokemon.orientation
    const skill = pokemon.skill
    const targetX = target.positionX
    const targetY = target.positionY
    const ap = Math.round(pokemon.ap * (crit ? pokemon.critPower : 1))
    super.process(pokemon, board, target, crit, true)
    const freezeDuration = 1500
    const damage = [10, 20, 40, 80][pokemon.stars - 1] ?? 80
    const targets: { x: number; y: number }[] = []
    board
      .getCellsInRadius(pokemon.positionX, pokemon.positionY, 4, false)
      .forEach((cell) => {
        if (cell.value && pokemon.team != cell.value.team) {
          const enemy = cell.value
          targets.push({ x: cell.x, y: cell.y })
          enemy.handleSpecialDamage(
            enemy.status.freeze ? Math.round(damage * 1.3) : damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          enemy.status.triggerFreeze(freezeDuration, enemy, pokemon)
        }
      })
    pokemon.broadcastAbility({
      skill,
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
