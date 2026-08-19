import { Weather } from "../../types/enum/Weather"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class GrowthStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)

    let attackBuff = [3, 5, 7, 14][pokemon.stars - 1] ?? 14
    let hpBuff = [10, 20, 40, 80][pokemon.stars - 1] ?? 80
    if (pokemon.simulation.weather === Weather.ZENITH) {
      attackBuff *= 2 // grows twice as fast if zenith weather
      hpBuff *= 2
    }
    pokemon.addAttack(attackBuff, pokemon, 1, crit)
    pokemon.addMaxHP(hpBuff, pokemon, 1, crit)
    pokemon.resetCooldown(250)
  }
}
