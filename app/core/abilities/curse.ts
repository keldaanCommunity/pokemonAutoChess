import { min } from "../../utils/number"
import { pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class CurseStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const enemies = board.cells.filter(
      (p) => p && p.team !== pokemon.team
    ) as PokemonEntity[]
    const highestHp = Math.max(...enemies.map((p) => p.maxHP))
    const enemiesWithHighestHP = enemies.filter((p) => p.maxHP === highestHp)
    const cursedEnemy = pickRandomIn(enemiesWithHighestHP)
    if (cursedEnemy) {
      const factor = 0.2
      const curseDelay = min(0)(
        ([8000, 5000, 3000, 1000][pokemon.stars - 1] ?? 1000) *
          (1 - (factor * pokemon.ap) / 100) *
          (crit ? 1 - (pokemon.critPower - 1) * factor : 1)
      )
      cursedEnemy.status.triggerCurse(curseDelay, cursedEnemy)
    }
  }
}
