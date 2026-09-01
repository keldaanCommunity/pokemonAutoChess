import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class VineWhipStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 100, 200][pokemon.stars - 1] ?? 200
    board
      .getAdjacentCells(target.positionX, target.positionY)
      .map((cell) => cell.value)
      .filter((entity) => entity?.team === target.team)
      .concat(target)
      .forEach((enemy) => {
        if (enemy) {
          enemy.status.triggerParalysis(3000, enemy, pokemon)
        }
      })
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}
