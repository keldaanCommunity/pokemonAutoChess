import { SetSchema } from "@colyseus/schema"
import {
  CraftableItems,
  Item,
  SynergyGivenByItem,
  SynergyStones
} from "../types/enum/Item"
import { pickRandomIn } from "../utils/random"
import { Pokemon } from "../models/colyseus-models/pokemon"
import { PokemonEntity } from "./pokemon-entity"
import { ItemStats } from "../types/Config"
import { Stat } from "../types/enum/Game"
import { EffectClass } from "../types/enum/EffectClass"

export function getWonderboxItems(existingItems: SetSchema<Item>): Item[] {
  const wonderboxItems: Item[] = []
  for (let n = 0; n < 2; n++) {
    const elligibleItems = CraftableItems.filter(
      (i) =>
        !SynergyStones.includes(i) &&
        !wonderboxItems.includes(i) &&
        !existingItems.has(i) &&
        i !== Item.WONDER_BOX
    )
    wonderboxItems.push(pickRandomIn(elligibleItems))
  }
  return wonderboxItems
}

export function onItemRemoved(item: Item, pokemon: Pokemon) {
  if (item in SynergyGivenByItem) {
    pokemon.types.delete(SynergyGivenByItem[item])
  }
}

export function triggerItem(
  effectClass: EffectClass,
  pokemon: PokemonEntity,
  item: Item
) {

  if (effectClass === EffectClass.APPLY && ItemStats[item]) {
    Object.entries(ItemStats[item]).forEach(([stat, value]) =>
      pokemon.applyStat(stat as Stat, value)
    )
  }

  function triggerSoulDew() {
    if (effectClass === EffectClass.APPLY) {
      pokemon.status.triggerSoulDew(1000)
    }
  }

  function triggerWideLens() {
    if (effectClass === EffectClass.APPLY) {
      pokemon.range += 2
    }
  }

  function triggerMaxRevive() {
    if (effectClass === EffectClass.APPLY) {
      pokemon.status.resurection = true
    }
  }

  function triggerSwiftWing() {
    if (effectClass === EffectClass.APPLY) {
      pokemon.addDodgeChance(0.1, pokemon, 0, false)
    }
  }

  function triggerFlameOrb() {
    if (effectClass === EffectClass.APPLY) {
      pokemon.addAttack(pokemon.baseAtk, pokemon, 0, false)
      pokemon.status.triggerBurn(
        60000,
        pokemon as PokemonEntity,
        pokemon as PokemonEntity
      )
    }
  }

  function triggerToxicOrb() {
    if (effectClass === EffectClass.APPLY) {
      pokemon.addAttack(pokemon.baseAtk, pokemon, 0, false)
      pokemon.status.triggerPoison(
        60000,
        pokemon as PokemonEntity,
        pokemon as PokemonEntity
      )
    }
  }

  function triggerPokerusVial() {
    if (effectClass === EffectClass.APPLY) {
      pokemon.status.triggerPokerus()
    }
  }

  function triggerFluffyTail() {
    if (effectClass === EffectClass.APPLY) {
      pokemon.status.triggerRuneProtect(60000)
    }
  }

  function triggerKingsRock() {
    if (effectClass === EffectClass.APPLY) {
      pokemon.addShield(0.3 * pokemon.hp, pokemon, 0, false)
    }
  }

  function triggerDynamaxBand() {
    if (effectClass === EffectClass.APPLY) {
      pokemon.addMaxHP(2.5 * pokemon.hp, pokemon, 0, false)
    }
  }

  function triggerTinyMushroom() {
    if (effectClass === EffectClass.APPLY) {
      pokemon.addMaxHP(-0.5 * pokemon.hp, pokemon, 0, false)
    }
  }

  function triggerGoldBottleCap() {
    if (effectClass === EffectClass.APPLY && pokemon.player) {
      pokemon.addCritChance(pokemon.player.money, pokemon, 0, false)
      pokemon.addCritPower(pokemon.player.money / 100, pokemon, 0, false)
    }
  }

  function triggerRepeatBall() {
    if (effectClass === EffectClass.APPLY && pokemon.player) {
      pokemon.addAbilityPower(
        Math.floor(
          (pokemon.player.rerollCount + pokemon.simulation.stageLevel) / 2
        ),
        pokemon,
        0,
        false
      )
    }
  }

  function triggerSacredAsh() {
    if (effectClass === EffectClass.APPLY) {
      pokemon.status.resurection = true
    }
  }

  const itemMap: ReadonlyMap<Item, () => void> = new Map([
    [Item.SOUL_DEW, triggerSoulDew],
    [Item.WIDE_LENS, triggerWideLens],
    [Item.MAX_REVIVE, triggerMaxRevive],
    [Item.SWIFT_WING, triggerSwiftWing],
    [Item.FLAME_ORB, triggerFlameOrb],
    [Item.TOXIC_ORB, triggerToxicOrb],
    [Item.POKERUS_VIAL, triggerPokerusVial],
    [Item.FLUFFY_TAIL, triggerFluffyTail],
    [Item.KINGS_ROCK, triggerKingsRock],
    [Item.DYNAMAX_BAND, triggerDynamaxBand],
    [Item.TINY_MUSHROOM, triggerTinyMushroom],
    [Item.GOLD_BOTTLE_CAP, triggerGoldBottleCap],
    [Item.REPEAT_BALL, triggerRepeatBall],
    [Item.SACRED_ASH, triggerSacredAsh]
  ])

  const process = itemMap.get(item)
  if (process) process()
}