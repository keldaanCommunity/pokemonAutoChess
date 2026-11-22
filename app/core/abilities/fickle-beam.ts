import { AttackType } from "../../types/enum/Game"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class FickleBeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [20, 30, 40, 50, 100][pokemon.stars - 1] ?? 100

    const highestSpeedEnemies = (
      board.cells.filter(
        (cell) => cell && cell.team !== pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => b.speed - a.speed)

    let numberOfBeam = 0
    for (let i = 0; i < 5; i++) {
      chance(0.5, pokemon) && numberOfBeam++
    }

    const beams: { x: number; y: number }[] = []
    const positionX = pokemon.positionX
    const positionY = pokemon.positionY
    for (let i = 0; i < numberOfBeam; i++) {
      const enemy = highestSpeedEnemies[i % highestSpeedEnemies.length]
      if (enemy) {
        enemy.status.triggerParalysis(2000, enemy, pokemon, false)
        enemy.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        beams.push({ x: enemy.positionX, y: enemy.positionY })
      }
    }
    if (beams.length > 0) {
      pokemon.broadcastAbility({ positionX, positionY, data: { beams } })
    }
  }
}
