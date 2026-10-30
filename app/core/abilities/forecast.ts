import { Pkm } from "../../types/enum/Pokemon"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ForecastStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    board.forEach((x: number, y: number, p: PokemonEntity | undefined) => {
      const shield = [10, 10, 10, 20][pokemon.stars - 1] ?? 20
      const attack = [4, 4, 4, 8][pokemon.stars - 1] ?? 8
      const pp = [8, 8, 8, 16][pokemon.stars - 1] ?? 16
      const def = [2, 2, 2, 4][pokemon.stars - 1] ?? 4
      if (p && pokemon.team === p.team) {
        p.addShield(shield, pokemon, 1, crit)
        if (pokemon.name === Pkm.CASTFORM_SUN) {
          p.addAttack(attack, pokemon, 1, crit)
        }
        if (pokemon.name === Pkm.CASTFORM_RAIN) {
          p.addPP(pp, pokemon, 1, crit)
        }
        if (pokemon.name === Pkm.CASTFORM_HAIL) {
          p.addDefense(def, pokemon, 1, crit)
          p.addSpecialDefense(def, pokemon, 1, crit)
        }
      }
    })
  }
}
