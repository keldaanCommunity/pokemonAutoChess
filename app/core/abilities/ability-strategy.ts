import { Transfer } from "../../types"
import { Item } from "../../types/enum/Item"
import Board from "../board"
import { PokemonEntity } from "../pokemon-entity"
import { min } from "../../utils/number"
import { OnAbilityCastEffect } from "../effects/effect"
import { values } from "../../utils/schemas"
import { ItemEffects } from "../effects/items"

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
      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: pokemon.skill,
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: target.positionX,
        targetY: target.positionY,
        orientation: pokemon.orientation
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
