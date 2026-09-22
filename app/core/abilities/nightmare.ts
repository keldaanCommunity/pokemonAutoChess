import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class NightmareStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const duration = [2000, 4000, 6000, 10000][pokemon.stars - 1] ?? 10000
    const damage = [25, 50, 100, 200][pokemon.stars - 1] ?? 200

    board.forEach((x: number, y: number, enemy: PokemonEntity | undefined) => {
      if (enemy && pokemon.team != enemy.team) {
        if (
          enemy.status.curseFate ||
          enemy.status.curseTorment ||
          enemy.status.curseVulnerability ||
          enemy.status.curseWeakness
        ) {
          enemy.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit,
            true
          )
        }
        enemy.status.triggerFatigue(duration, enemy, pokemon)
      }
    })
  }
}
