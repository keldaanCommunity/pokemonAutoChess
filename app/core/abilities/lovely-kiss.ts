import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class LovelyKissStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    if (target.status.sleep) {
      const damage = [50, 100, 150, 300][pokemon.stars - 1] ?? 300
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    } else {
      const duration = Math.round(
        ([2000, 4000, 6000, 12000][pokemon.stars - 1] ?? 12000) *
          (1 + pokemon.ap / 100) *
          (crit ? pokemon.critPower : 1)
      )
      target.status.triggerSleep(duration, target)
    }
  }
}
