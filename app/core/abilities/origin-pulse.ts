import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class OriginPulseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const { positionX, positionY, orientation, skill } = pokemon
    const targetX = target.positionX
    const targetY = target.positionY
    const ap = Math.round(pokemon.ap * (crit ? pokemon.critPower : 1))
    const targets: { x: number; y: number }[] = []
    super.process(pokemon, board, target, crit, true)
    const damage = [50, 75, 100, 120, 150][pokemon.stars - 1] ?? 150
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team && target.positionY == y) {
        targets.push({ x, y })
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
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
