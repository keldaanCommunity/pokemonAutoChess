import { AttackType } from "../../types/enum/Game"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class WaterPulseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [70, 140, 280, 500][pokemon.stars - 1] ?? 500
    board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .map((cell) => cell.value)
      .filter((value): value is PokemonEntity => value?.team === target.team)
      .forEach((v) => {
        if (chance(0.3, pokemon)) {
          v.status.triggerConfusion(2000, v, pokemon)
        }
        v.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
      })
  }
}
