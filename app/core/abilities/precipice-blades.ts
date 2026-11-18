import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class PrecipiceBladesStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [25, 50, 100, 120, 200][pokemon.stars - 1] ?? 200
    const positionX = pokemon.positionX
    const positionY = pokemon.positionY
    const orientation = pokemon.orientation
    const ap = Math.round(pokemon.ap * (crit ? pokemon.critPower : 1))
    const targetX = target ? target.positionX : -1
    const targetY = target ? target.positionY : -1
    const targets: { x: number; y: number }[] = []
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (
        (tg && pokemon.team !== tg.team && pokemon.positionY === y) ||
        (tg && pokemon.team !== tg.team && pokemon.positionX === x)
      ) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
        targets.push({ x, y })
      }
    })
    pokemon.broadcastAbility({
      skill: Ability.PRECIPICE_BLADES,
      positionX,
      positionY,
      orientation,
      ap,
      targetX,
      targetY,
      data: { targets }
    })
  }
}
