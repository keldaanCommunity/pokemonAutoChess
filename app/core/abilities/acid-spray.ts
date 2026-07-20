import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class AcidSprayStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    let tg: PokemonEntity | undefined = target
    const affectedTargetsIds = new Array<string>()
    const damage = [11, 22, 33, 66][pokemon.stars - 1] ?? 66
    for (let i = 0; i < 5; i++) {
      if (tg) {
        pokemon.broadcastAbility({
          targetX: tg.positionX,
          targetY: tg.positionY
        })
        tg.addSpecialDefense(-5, pokemon, 0, false)
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
        affectedTargetsIds.push(tg.id)
        const cells = board.getAdjacentCells(tg.positionX, tg.positionY)
        tg = cells
          .filter(
            (v) =>
              v.value &&
              v.value.team !== pokemon.team &&
              !affectedTargetsIds.includes(v.value.id)
          )
          .map((v) => v.value)[0]
      } else {
        break
      }
    }
  }
}
