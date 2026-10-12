import { EffectEnum } from "../../types/enum/Effect"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class PoisonStingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let maxStacks = 3
    if (pokemon.effects.has(EffectEnum.VENOMOUS)) {
      maxStacks = 4
    }
    if (pokemon.effects.has(EffectEnum.TOXIC)) {
      maxStacks = 5
    }

    const nbStacksToApply = [2, 3, 4, 5][pokemon.stars - 1] ?? 5
    const currentStacks = target.status.poisonStacks
    const extraDamage =
      currentStacks + nbStacksToApply > maxStacks
        ? (currentStacks + nbStacksToApply - maxStacks) *
          ([25, 50, 100, 150][pokemon.stars - 1] ?? 150)
        : 0
    for (let i = 0; i < nbStacksToApply; i++) {
      target.status.triggerPoison(4000, target, pokemon)
    }
    if (extraDamage > 0) {
      target.handleSpecialDamage(
        extraDamage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
  }
}
