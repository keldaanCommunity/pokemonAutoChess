import { Dishes, Item } from "../types/enum/Item"
import { Pkm } from "../types/enum/Pokemon"
import { Effect, OnSpawnEffect, OnHitEffect, PeriodicEffect } from "./effect"
import { Effect as EffectEnum } from "../types/enum/Effect"
import { Synergy } from "../types/enum/Synergy"
import { chance } from "../utils/random"

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
  [Pkm.MILTANK]: Item.MOOMOO_MILK,
  [Pkm.GULPIN]: Item.BLACK_SLUDGE,
  [Pkm.SWALOT]: Item.BLACK_SLUDGE,
  [Pkm.BOUNSWEET]: Item.FRUIT_JUICE,
  [Pkm.STEENEE]: Item.FRUIT_JUICE,
  [Pkm.TSAREENA]: Item.FRUIT_JUICE,
  [Pkm.FARFETCH_D]: Item.LEEK,
  [Pkm.GALARIAN_FARFETCH_D]: Item.LARGE_LEEK,
  [Pkm.SPINDA]: Item.SPINDA_COCKTAIL
}

export const DishEffects: Record<(typeof Dishes)[number], Effect[]> = {
  BERRIES: [],
  BERRY_JUICE: [
    new OnSpawnEffect((entity) => {
      entity.addShield(50, entity, 0, false)
      entity.effects.add(EffectEnum.BERRY_JUICE)
    })
  ],
  BLACK_SLUDGE: [
    new OnSpawnEffect((entity) => {
      if (entity.types.has(Synergy.POISON)) {
        entity.effectsSet.add(
          new PeriodicEffect(
            (entity) => {
              entity.handleHeal(0.05 * entity.hp, entity, 0, false)
            },
            Item.SWEET_HERB,
            2000
          )
        )
      } else {
        entity.status.triggerPoison(30000, entity, entity)
      }
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
  FRUIT_JUICE: [
    new OnSpawnEffect((entity) => {
      entity.addAttackSpeed(30, entity, 0, false)
    })
  ],
  HONEY: [],
  LARGE_LEEK: [
    new OnSpawnEffect((entity) => {
      entity.effects.add(EffectEnum.ABILITY_CRIT)
      entity.addCritPower(30, entity, 0, false)
    })
  ],
  LEEK: [
    new OnSpawnEffect((entity) => {
      entity.effects.add(EffectEnum.ABILITY_CRIT)
      entity.addCritChance(30, entity, 0, false)
    })
  ],
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
  SPINDA_COCKTAIL: [
    new OnSpawnEffect((entity) => {
      if (chance(0.8, entity)) {
        entity.addAttack(5, entity, 0, false)
      }
      if (chance(0.8, entity)) {
        entity.addAttackSpeed(25, entity, 0, false)
      }
      if (chance(0.8, entity)) {
        entity.addAbilityPower(25, entity, 0, false)
      }
      if (chance(0.8, entity)) {
        entity.addShield(50, entity, 0, false)
      }

      if (!chance(0.8, entity)) {
        entity.status.triggerConfusion(5000, entity, entity)
      } else if (!chance(0.8, entity)) {
        entity.status.triggerBlinded(5000, entity)
      } else if (!chance(0.8, entity)) {
        entity.status.triggerSleep(5000, entity)
      }
    })
  ],
  SWEET_APPLE: [
    new OnSpawnEffect((entity) => {
      entity.addShield(80, entity, 0, false)
    })
  ],
  SWEET_HERB: [
    new OnSpawnEffect((entity) => {
      entity.addAbilityPower(50, entity, 0, false)
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
