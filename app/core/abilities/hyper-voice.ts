import { AttackType } from "../../types/enum/Game"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class HyperVoiceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const damage = [25, 50, 100, 200][pokemon.stars - 1] ?? 200
    const confusionDuration = [1000, 2000, 3000, 6000][pokemon.stars - 1] ?? 6000

    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team && target.positionY == y) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
        if (chance(0.3, pokemon)) {
          tg.status.triggerConfusion(confusionDuration, tg, pokemon)
        }
      }
    })
  }
}
