import { EffectEnum } from "../../types/enum/Effect"
import { distanceC } from "../../utils/distance"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class CottonSporeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const NB_MAX_TARGETS = 3
    const speedDebuff = [10, 20, 30, 50][pokemon.stars - 1] ?? 50
    const enemies = board.cells
      .filter<PokemonEntity>(
        (v): v is PokemonEntity => v != null && v.team !== pokemon.team
      )
      .sort((a, b) => {
        const distanceA = distanceC(
          pokemon.positionX,
          pokemon.positionY,
          a.positionX,
          a.positionY
        )
        const distanceB = distanceC(
          pokemon.positionX,
          pokemon.positionY,
          b.positionX,
          b.positionY
        )
        return distanceA - distanceB
      })
    const nearestEnemies = enemies.slice(0, NB_MAX_TARGETS)

    nearestEnemies.forEach((enemy) => {
      enemy.addSpeed(-speedDebuff, pokemon, 1, crit)
      board.addBoardEffect(
        enemy.positionX,
        enemy.positionY,
        EffectEnum.COTTON_BALL,
        pokemon.simulation
      )
      pokemon.broadcastAbility({
        targetX: enemy.positionX,
        targetY: enemy.positionY
      })
    })
  }
}
