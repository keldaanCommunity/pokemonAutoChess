import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class TickleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const attackLost = 3
    const defLost = 3
    const nbMaxEnemiesHit = [1, 2, 3, 5][pokemon.stars - 1] ?? 5
    const closestEnemies = board.getClosestEnemies(
      pokemon.positionX,
      pokemon.positionY,
      target.team
    )
    const enemiesHit = closestEnemies.slice(0, nbMaxEnemiesHit)
    enemiesHit.forEach((enemy) => {
      enemy.addAttack(-attackLost, pokemon, 1, crit)
      enemy.addDefense(-defLost, pokemon, 1, crit)
    })
  }
}
