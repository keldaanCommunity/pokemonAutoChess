import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class BloomDoomStrategy extends AbilityStrategy {
  requiresTarget = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    // An explosion of petals hits the target and all enemies in a 2-tile radius around it, dealing [50,100,150,200,300,SP] SPECIAL.
    // The allies in the area heal for [50,100,150,200,300,SP] HP
    super.process(pokemon, board, target, crit)
    const damage = [50, 100, 150, 200, 300][pokemon.stars - 1] ?? 300
    const heal = [50, 100, 150, 200, 300][pokemon.stars - 1] ?? 300
    board
      .getCellsInRadius(target.positionX, target.positionY, 2, true)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        } else if (cell.value && cell.value.team === pokemon.team) {
          cell.value.handleHeal(heal, pokemon, 1, crit)
        }
      })
  }
}
