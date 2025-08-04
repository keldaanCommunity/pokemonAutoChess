import { Item } from "../../types/enum/Item"
import { min } from "../../utils/number"
import { values } from "../../utils/schemas"
import type { Board } from "../board"
import { OnAbilityCastEffect } from "../effects/effect"
import { ItemEffects } from "../effects/items"
import { PokemonEntity } from "../pokemon-entity"

export class AbilityStrategy {
  copyable = true // if true, can be copied by mimic, metronome, encore...
  canCritByDefault = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean,
    preventDefaultAnim?: boolean
  ) {
    pokemon.pp = min(0)(pokemon.pp - pokemon.maxPP)
    pokemon.count.ult += 1

    if (!preventDefaultAnim) {
      pokemon.broadcastAbility({
        targetX: target.positionX,
        targetY: target.positionY,
        ap: pokemon.ap * (crit ? pokemon.critPower : 1),
      })
    }

    const onAbilityCastEffects = [
      ...pokemon.effectsSet.values(),
      ...values<Item>(pokemon.items).flatMap((item) => ItemEffects[item] ?? [])
    ].filter((effect) => effect instanceof OnAbilityCastEffect)

    onAbilityCastEffects.forEach((effect) => {
      effect.apply(pokemon, board, target, crit)
    })
  }
}