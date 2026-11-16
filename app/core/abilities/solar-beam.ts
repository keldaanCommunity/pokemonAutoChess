import { AttackType } from "../../types/enum/Game"
import { Weather } from "../../types/enum/Weather"
import type { Board } from "../board"
import { effectInLine } from "../board"

import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SolarBeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage = [25, 50, 100, 200][pokemon.stars - 1] ?? 200
    if (pokemon.simulation.weather === Weather.ZENITH || pokemon.status.light) {
      damage = damage * 1.3
      pokemon.addPP(20, pokemon, 0, false)
    }
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.status.triggerBurn(3000, cell.value, pokemon)
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
