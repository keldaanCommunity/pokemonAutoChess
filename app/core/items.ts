import { SetSchema } from "@colyseus/schema"
import {
  CraftableItems,
  Item,
  SynergyGivenByItem,
  SynergyStones
} from "../types/enum/Item"
import { Effect, OnItemGainedEffect, OnItemRemovedEffect } from "./effect"
import { pickRandomIn } from "../utils/random"
import { Pokemon } from "../models/colyseus-models/pokemon"
import { PokemonEntity } from "./pokemon-entity"
import { min } from "../utils/number"

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

export const ItemEffects: { [i in Item]?: Effect[] } = {
  [Item.SOUL_DEW]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.status.triggerSoulDew(1000)
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.status.soulDew = false
      pokemon.status.soulDewCooldown = 0
      pokemon.addAbilityPower(
        -10 * pokemon.count.soulDewCount,
        pokemon,
        0,
        false
      )
      pokemon.count.soulDewCount = 0
    })
  ],

  [Item.WIDE_LENS]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.range += 2
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.range = min(1)(pokemon.range - 2)
    })
  ],

  [Item.MAX_REVIVE]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.status.resurection = true
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.status.resurection = false
    })
  ],

  [Item.SWIFT_WING]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.addDodgeChance(0.1, pokemon, 0, false)
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.addDodgeChance(-0.1, pokemon, 0, false)
    })
  ],

  [Item.FLAME_ORB]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.addAttack(pokemon.baseAtk, pokemon, 0, false)
      pokemon.status.triggerBurn(
        60000,
        pokemon as PokemonEntity,
        pokemon as PokemonEntity
      )
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.addAttack(-pokemon.baseAtk, pokemon, 0, false)
      pokemon.status.burnCooldown = 0
    })
  ],

  [Item.TOXIC_ORB]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.addAttack(pokemon.baseAtk, pokemon, 0, false)
      pokemon.status.triggerPoison(
        60000,
        pokemon as PokemonEntity,
        pokemon as PokemonEntity
      )
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.addAttack(-pokemon.baseAtk, pokemon, 0, false)
      pokemon.status.poisonCooldown = 0
    })
  ],

  [Item.POKERUS_VIAL]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.status.triggerPokerus()
    })
    // intentionally no item removal effect
  ],

  [Item.FLUFFY_TAIL]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.status.triggerRuneProtect(60000)
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.status.runeProtectCooldown = 0
    })
  ],

  [Item.KINGS_ROCK]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.addShield(0.3 * pokemon.baseHP, pokemon, 0, false)
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.addShield(-0.3 * pokemon.baseHP, pokemon, 0, false)
    })
  ],

  [Item.DYNAMAX_BAND]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.addMaxHP(2.5 * pokemon.baseHP, pokemon, 0, false)
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.addMaxHP(-2.5 * pokemon.baseHP, pokemon, 0, false)
    })
  ],

  [Item.TINY_MUSHROOM]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.addMaxHP(-0.5 * pokemon.baseHP, pokemon, 0, false)
    })
    // intentionally no item removal effect
  ],

  [Item.GOLD_BOTTLE_CAP]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.addCritChance(pokemon.player?.money ?? 0, pokemon, 0, false)
      pokemon.addCritPower(
        (pokemon.player?.money ?? 0) / 100,
        pokemon,
        0,
        false
      )
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.addCritChance(-(pokemon.player?.money ?? 0), pokemon, 0, false)
      pokemon.addCritPower(
        -(pokemon.player?.money ?? 0) / 100,
        pokemon,
        0,
        false
      )
    })
  ],

  [Item.REPEAT_BALL]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.addAbilityPower(
        Math.floor(
          ((pokemon.player?.rerollCount ?? 0) + pokemon.simulation.stageLevel) /
            2
        ),
        pokemon,
        0,
        false
      )
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.addAbilityPower(
        -Math.floor(
          ((pokemon.player?.rerollCount ?? 0) + pokemon.simulation.stageLevel) /
            2
        ),
        pokemon,
        0,
        false
      )
    })
  ],
  
  [Item.SACRED_ASH]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.status.resurection = true
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.status.resurection = false
    })
  ],

  [Item.UPGRADE]: [
    new OnItemRemovedEffect((pokemon) => {
      pokemon.addAttackSpeed(
        -5 * pokemon.count.upgradeCount,
        pokemon,
        0,
        false
      )
      pokemon.count.upgradeCount = 0
    })
  ],

  [Item.DEFENSIVE_RIBBON]: [
    new OnItemRemovedEffect((pokemon) => {
      const stacks = Math.floor(pokemon.count.defensiveRibbonCount / 2)
      pokemon.addAttack(-stacks, pokemon, 0, false)
      pokemon.addDefense(-stacks, pokemon, 0, false)
      pokemon.addAttackSpeed(-5* stacks, pokemon, 0, false)
      pokemon.count.defensiveRibbonCount = 0
    })
  ]
}
