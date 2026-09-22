import { EffectEnum } from "../../types/enum/Effect"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import { OnAbilityCastEffect } from "../effects/effect"
import type { PokemonEntity } from "../pokemon-entity"
import type { AbilityStrategy } from "./ability-strategy"

export function castAbility(
  abilityStrategy: AbilityStrategy,
  pokemon: PokemonEntity,
  board: Board,
  target: PokemonEntity | null,
  canCrit = true,
  preventDefaultAnim = false
) {
  if (pokemon.canCast === false) return

  let crit = false
  if (
    canCrit &&
    (pokemon.effects.has(EffectEnum.ABILITY_CRIT) ||
      abilityStrategy.canCritByDefault)
  ) {
    crit = chance(pokemon.critChance / 100, pokemon)
  }
  abilityStrategy.process(pokemon, board, target, crit, preventDefaultAnim)

  pokemon.getEffects(OnAbilityCastEffect).forEach((effect) => {
    effect.apply(pokemon, board, target, crit)
  })
}
