import Board from "./board"
import { PokemonEntity } from "./pokemon-entity"
import { Item } from "../types/enum/Item"
import { Effect as EffectEnum } from "../types/enum/Effect"
import { Synergy, SynergyEffects } from "../types/enum/Synergy"
import { max } from "../utils/number"

type EffectOrigin = EffectEnum | Item

export abstract class Effect {
  origin?: EffectOrigin
  apply: (entity: PokemonEntity, ...others: any[]) => void
  resetStacks?: (entity: PokemonEntity) => void
  constructor(
    effect: (entity: PokemonEntity, ...others: any[]) => void,
    origin?: EffectOrigin,
    resetStacks?: (entity: PokemonEntity) => void
  ) {
    this.apply = effect
    this.origin = origin
    this.resetStacks = resetStacks
  }
}

// item effect applied on fight start of after stealing/obtaining an item
export class OnItemGainedEffect extends Effect {}

export class OnItemRemovedEffect extends Effect {}

export class PeriodicEffect extends Effect {
  intervalMs: number
  timer: number
  count: number

  constructor(
    effect: (entity: PokemonEntity) => void,
    intervalMs: number,
    origin?: EffectOrigin,
    resetStacks?: (entity: PokemonEntity) => void
  ) {
    super(effect, origin, resetStacks)
    this.intervalMs = intervalMs
    this.timer = intervalMs
    this.count = 0
  }

  update(dt: number, entity: PokemonEntity) {
    this.timer -= dt
    if (this.timer <= 0) {
      this.count++
      this.apply(entity)
      this.timer = this.intervalMs
    }
  }
}

export class GrowGroundEffect extends PeriodicEffect {
  constructor(effect: EffectEnum) {
    const synergyLevel = SynergyEffects[Synergy.GROUND].indexOf(effect) + 1
    super(
      (pokemon) => {
        if (this.count > 5) {
          return
        }
        pokemon.addDefense(synergyLevel, pokemon, 0, false)
        pokemon.addSpecialDefense(synergyLevel, pokemon, 0, false)
        pokemon.addAttack(synergyLevel, pokemon, 0, false)
        pokemon.transferAbility("GROUND_GROW")
        if (
          pokemon.items.has(Item.BIG_NUGGET) &&
          this.count === 5 &&
          pokemon.player
        ) {
          pokemon.player.addMoney(3, true, pokemon)
          pokemon.count.moneyCount += 3
        }
      },
      3000,
      effect,
      (pokemon) => {
        const removalAmount = -synergyLevel * max(5)(this.count)
        pokemon.addDefense(removalAmount, pokemon, 0, false)
        pokemon.addSpecialDefense(removalAmount, pokemon, 0, false)
        pokemon.addAttack(removalAmount, pokemon, 0, false)
        this.count = 0
      }
    )
  }
}

// applied after knocking out an enemy
export class OnKillEffect extends Effect {
  apply: (entity: PokemonEntity, target: PokemonEntity, board: Board) => void
  constructor(
    effect: (entity: PokemonEntity, target: PokemonEntity, board: Board) => void
  ) {
    super(effect)
    this.apply = effect
  }
}
