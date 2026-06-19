import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SoulTrapStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Gain [25,50,108,108] SHIELD, then enemies within a 2-tile radius lose [10,10,10,50,SP] PP and get FATIGUE for [2,2,2,5,SP,ND=1] seconds and choose the user as the target.
    const shieldAmount = [25, 50, 108, 108][pokemon.stars - 1] ?? 108
    const ppLoss = [10, 10, 10, 50][pokemon.stars - 1] ?? 50
    const fatigueDuration = Math.round(
      ([2000, 2000, 2000, 5000][pokemon.stars - 1] ?? 5000) * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
    )
    pokemon.addShield(shieldAmount, pokemon, 0, false)
    const enemies = board
      .getCellsInRadius(pokemon.positionX, pokemon.positionY, 2, false)
      .filter((cell) => cell.value && cell.value.team !== pokemon.team)
    enemies.forEach((cell) => {
      const enemy = cell.value!
      enemy.addPP(-ppLoss, pokemon, 1, crit)
      enemy.status.triggerFatigue(fatigueDuration, enemy)
    })
  }
}
