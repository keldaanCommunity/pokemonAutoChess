import { AttackType } from "../../types/enum/Game"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class AxeKickStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    // Leap to the enemy with the highest PP then deal [30,60,100,200,SP] SPECIAL and burn [15,15,30,60,SP] PP.
    // Has [30,LK]% chance to inflict CONFUSION for 3 seconds
    const highestPPEnemies = board.cells
      .filter(
        (e): e is PokemonEntity => e !== undefined && e.team !== pokemon.team
      )
      .sort((a, b) => b!.pp - a!.pp)
    let highestPPEnemy: PokemonEntity | null = null
    let freeSpot: { x: number; y: number } | null = null
    do {
      highestPPEnemy = highestPPEnemies.shift() ?? null
      freeSpot = highestPPEnemy
        ? board.getClosestAvailablePlace(
            highestPPEnemy.positionX,
            highestPPEnemy.positionY
          )
        : null
    } while (highestPPEnemies.length > 0 && (!highestPPEnemy || !freeSpot))

    if (highestPPEnemy && freeSpot) {
      pokemon.moveTo(freeSpot.x, freeSpot.y, board, false)
      const damage = [25, 50, 100][pokemon.stars - 1] ?? 100
      highestPPEnemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      highestPPEnemy.addPP(-15, pokemon, 1, crit)
      if (chance(0.3, pokemon)) {
        highestPPEnemy.status.triggerConfusion(3000, highestPPEnemy, pokemon)
      }
    }
  }
}
