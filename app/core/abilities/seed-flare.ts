import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SeedFlareStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 25, 30, 60][pokemon.stars - 1] ?? 60
    const spDefDebuff = [-3, -3, -3, -6][pokemon.stars - 1] ?? -6

    board
      .getCellsInRadius(pokemon.positionX, pokemon.positionY, 5, false)
      .forEach((cell) => {
        if (cell.value && pokemon.team !== cell.value.team) {
          cell.value.addSpecialDefense(spDefDebuff, pokemon, 0, false)
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
  }
}
