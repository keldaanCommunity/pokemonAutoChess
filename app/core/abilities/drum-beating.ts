import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class DrumBeatingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    switch (pokemon.count.ult % 3) {
      case 0: {
        // give 10/20/40 speed to the entire team
        const speed = [10, 20, 40, 80][pokemon.stars - 1] ?? 80
        board.forEach((x, y, entity) => {
          if (entity && entity.team === pokemon.team) {
            entity.addSpeed(speed, pokemon, 1, crit)
          }
        })
        break
      }
      case 1: {
        // give 10/20/40 shield to the entire team
        const shield = [10, 20, 40, 80][pokemon.stars - 1] ?? 80
        board.forEach((x, y, entity) => {
          if (entity && entity.team === pokemon.team) {
            entity.addShield(shield, pokemon, 1, crit)
          }
        })
        break
      }
      case 2:
      default: {
        // deal 10/20/40 special damage to the opponent team
        const damage = [10, 20, 40, 80][pokemon.stars - 1] ?? 80
        board.forEach((x, y, entity) => {
          if (entity && entity.team !== pokemon.team) {
            entity.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        })
        break
      }
    }
  }
}
