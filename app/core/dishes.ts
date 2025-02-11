import { Dishes, Item } from "../types/enum/Item"
import { Pkm } from "../types/enum/Pokemon"
import { Effect, OnSpawnEffect, OnHitEffect, PeriodicEffect } from "./effect"
import { Effect as EffectEnum } from "../types/enum/Effect"
import GameState from "../rooms/states/game-state"
import PokemonFactory from "../models/pokemon-factory"
import { PRECOMPUTED_POKEMONS_PER_TYPE_AND_CATEGORY } from "../models/precomputed/precomputed-types-and-categories"
import { IPokemon, IPlayer } from "../types"
import { Rarity } from "../types/enum/Game"
import { getFirstAvailablePositionInBench } from "../utils/board"
import { pickRandomIn } from "../utils/random"
import { values } from "../utils/schemas"
import { getPokemonData } from "../models/precomputed/precomputed-pokemon-data"

export const DishByPkm: { [pkm in Pkm]?: Item } = {
  [Pkm.LICKITUNG]: Item.RAGE_CANDY_BAR,
  [Pkm.LICKILICKY]: Item.RAGE_CANDY_BAR,
  [Pkm.SINISTEA]: Item.TEA,
  [Pkm.POLTEAGEIST]: Item.TEA,
  [Pkm.CAPSAKID]: Item.CURRY,
  [Pkm.SCOVILLAIN]: Item.CURRY,
  [Pkm.VANILLITE]: Item.CASTELIACONE,
  [Pkm.VANILLISH]: Item.CASTELIACONE,
  [Pkm.VANILLUXE]: Item.CASTELIACONE,
  [Pkm.SWIRLIX]: Item.WHIPPED_DREAM,
  [Pkm.SLURPUFF]: Item.WHIPPED_DREAM,
  [Pkm.APPLIN]: Item.TART_APPLE,
  [Pkm.CHERRUBI]: Item.SWEET_HERB,
  [Pkm.CHERRIM]: Item.SWEET_HERB,
  [Pkm.CHERRIM_SUNLIGHT]: Item.SWEET_HERB,
  [Pkm.TROPIUS]: Item.BERRIES,
  [Pkm.SHUCKLE]: Item.BERRY_JUICE,
  [Pkm.COMBEE]: Item.HONEY,
  [Pkm.VESPIQUEEN]: Item.HONEY,
  [Pkm.HAPPINY]: Item.NUTRITIOUS_EGG,
  [Pkm.CHANSEY]: Item.NUTRITIOUS_EGG,
  [Pkm.BLISSEY]: Item.NUTRITIOUS_EGG,
  [Pkm.NACLI]: Item.ROCK_SALT,
  [Pkm.NACLSTACK]: Item.ROCK_SALT,
  [Pkm.GARGANACL]: Item.ROCK_SALT,
  [Pkm.MUNCHLAX]: Item.LEFTOVERS,
  [Pkm.SNORLAX]: Item.LEFTOVERS,
  [Pkm.MILTANK]: Item.MOOMOO_MILK
}

export const DishEffects: Record<(typeof Dishes)[number], Effect[]> = {
  BERRIES: [],
  BERRY_JUICE: [
    new OnSpawnEffect((entity) => {
      entity.addShield(50, entity, 0, false)
      entity.effects.add(EffectEnum.BERRY_JUICE)
    })
  ],
  CASTELIACONE: [
    new OnSpawnEffect((entity) => {
      entity.effects.add(EffectEnum.CASTELIACONE)
    }),
    new OnHitEffect((entity, target, board) => {
      if (entity.effects.has(EffectEnum.CASTELIACONE)) {
        target.status.triggerFreeze(5000, target)
        entity.effects.delete(EffectEnum.CASTELIACONE)
      }
    })
  ],
  CURRY: [
    new OnSpawnEffect((entity) => {
      entity.status.triggerRage(5000, entity)
    })
  ],
  HONEY: [],
  LEFTOVERS: [],
  MOOMOO_MILK: [
    new OnSpawnEffect((entity) => {
      entity.addMaxHP(10, entity, 0, false, true)
    })
  ],
  NUTRITIOUS_EGG: [
    new OnSpawnEffect((entity) => {
      // Start the next fight with +30% base ATK, DEF, SPE_DEF and AP
      entity.addAttack(0.3 * entity.baseAtk, entity, 0, false)
      entity.addDefense(0.3 * entity.baseDef, entity, 0, false)
      entity.addSpecialDefense(0.3 * entity.baseSpeDef, entity, 0, false)
      entity.addAbilityPower(30, entity, 0, false)
    })
  ],
  RAGE_CANDY_BAR: [
    new OnSpawnEffect((entity) => {
      entity.addAttack(5, entity, 0, false)
    })
  ],
  ROCK_SALT: [
    new OnSpawnEffect((entity) => {
      entity.status.triggerRuneProtect(8000)
    })
  ],
  SIRUPY_APPLE: [
    new OnSpawnEffect((entity) => {
      entity.addShield(100, entity, 0, false)
    })
  ],
  SWEET_APPLE: [
    new OnSpawnEffect((entity) => {
      entity.addShield(80, entity, 0, false)
    })
  ],
  SWEET_HERB: [
    new OnSpawnEffect((entity) => {
      entity.effectsSet.add(
        new PeriodicEffect(
          (entity) => {
            entity.handleHeal(0.05 * entity.hp, entity, 0, false)
          },
          Item.SWEET_HERB,
          2000
        )
      )
    })
  ],
  TEA: [
    new OnSpawnEffect((entity) => {
      entity.addPP(50, entity, 0, false)
    })
  ],
  TART_APPLE: [
    new OnSpawnEffect((entity) => {
      entity.addShield(50, entity, 0, false)
    })
  ],
  WHIPPED_DREAM: [
    new OnSpawnEffect((entity) => {
      entity.effects.add(EffectEnum.WHIPPED_DREAM)
    }),
    new OnHitEffect((entity, target, board) => {
      if (entity.effects.has(EffectEnum.WHIPPED_DREAM)) {
        target.status.triggerCharm(5000, target, entity)
        entity.effects.delete(EffectEnum.WHIPPED_DREAM)
      }
    })
  ]
}
