import { Effect as EffectEnum } from "../types/enum/Effect"
import { Stat } from "../types/enum/Game"
import { Berries, Dishes, Item } from "../types/enum/Item"
import { Pkm } from "../types/enum/Pokemon"
import { Synergy } from "../types/enum/Synergy"
import { chance } from "../utils/random"
import { values } from "../utils/schemas"
import { Effect, OnHitEffect, OnSpawnEffect, PeriodicEffect } from "./effect"

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
  [Pkm.FLAPPLE]: Item.TART_APPLE,
  [Pkm.APPLETUN]: Item.SWEET_APPLE,
  [Pkm.DIPPLIN]: Item.SIRUPY_APPLE,
  [Pkm.HYDRAPPLE]: Item.SIRUPY_APPLE,
  [Pkm.CHERUBI]: Item.SWEET_HERB,
  [Pkm.CHERRIM]: Item.SWEET_HERB,
  [Pkm.CHERRIM_SUNLIGHT]: Item.SWEET_HERB,
  [Pkm.TROPIUS]: Item.BERRIES,
  [Pkm.SHUCKLE]: Item.BERRY_JUICE,
  [Pkm.COMBEE]: Item.HONEY,
  [Pkm.VESPIQUEEN]: Item.HONEY,
  [Pkm.CHANSEY]: Item.NUTRITIOUS_EGG,
  [Pkm.BLISSEY]: Item.NUTRITIOUS_EGG,
  [Pkm.NACLI]: Item.ROCK_SALT,
  [Pkm.NACLSTACK]: Item.ROCK_SALT,
  [Pkm.GARGANACL]: Item.ROCK_SALT,
  [Pkm.FIDOUGH]: Item.POFFIN,
  [Pkm.DACHSBUN]: Item.POFFIN,
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
  [Pkm.SPINDA]: Item.SPINDA_COCKTAIL,
  [Pkm.MILCERY]: Item.SWEETS,
  [Pkm.ALCREMIE_VANILLA]: Item.SWEETS,
  [Pkm.ALCREMIE_RUBY]: Item.SWEETS,
  [Pkm.ALCREMIE_MATCHA]: Item.SWEETS,
  [Pkm.ALCREMIE_MINT]: Item.SWEETS,
  [Pkm.ALCREMIE_LEMON]: Item.SWEETS,
  [Pkm.ALCREMIE_SALTED]: Item.SWEETS,
  [Pkm.ALCREMIE_RUBY_SWIRL]: Item.SWEETS,
  [Pkm.ALCREMIE_CARAMEL_SWIRL]: Item.SWEETS,
  [Pkm.ALCREMIE_RAINBOW_SWIRL]: Item.SWEETS,
  [Pkm.PECHARUNT]: Item.BINDING_MOCHI,
  [Pkm.VELUZA]: Item.SMOKED_FILET
}

export const DishEffects: Record<(typeof Dishes)[number], Effect[]> = {
  BERRIES: [],
  BERRY_JUICE: [
    new OnSpawnEffect((entity) => {
      entity.addShield(80, entity, 0, false)
      entity.effects.add(EffectEnum.BERRY_JUICE)
    })
  ],
  BINDING_MOCHI: [
    new OnSpawnEffect((entity) => {
      entity.effects.add(EffectEnum.BINDING_MOCHI)
    }),
    new OnHitEffect((entity, target, board) => {
      if (entity.effects.has(EffectEnum.BINDING_MOCHI)) {
        target.status.triggerCharm(4000, target, entity, false)
        target.status.triggerPoison(4000, target, entity)
        entity.effects.delete(EffectEnum.BINDING_MOCHI)
      }
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
      entity.applyStat(Stat.SPEED, 50)
    })
  ],
  HEARTY_STEW: [
    new OnSpawnEffect((entity) => {
      entity.applyStat(Stat.HP, 0.3 * entity.baseHP)
    })
  ],
  HONEY: [],
  LARGE_LEEK: [
    new OnSpawnEffect((entity) => {
      entity.effects.add(EffectEnum.ABILITY_CRIT)
      entity.applyStat(Stat.CRIT_POWER, 100)
    })
  ],
  LEEK: [
    new OnSpawnEffect((entity) => {
      entity.effects.add(EffectEnum.ABILITY_CRIT)
      entity.applyStat(Stat.CRIT_CHANCE, 50)
    })
  ],
  LEFTOVERS: [],
  MOOMOO_MILK: [
    new OnSpawnEffect((entity) => {
      entity.applyStat(Stat.HP, 10, entity, 0, false, true)
    })
  ],
  NUTRITIOUS_EGG: [
    new OnSpawnEffect((entity) => {
      // Start the next fight with +30% base ATK, DEF, SPE_DEF and AP
      entity.applyStat(Stat.ATK, 0.3 * entity.baseAtk)
      entity.applyStat(Stat.DEF, 0.3 * entity.baseDef)
      entity.applyStat(Stat.SPE_DEF, 0.3 * entity.baseSpeDef)
    })
  ],
  POFFIN: [
    new OnSpawnEffect((entity) => {
      entity.addShield(100, entity, 0, false)
      values(entity.items)
        .filter((item) => Berries.includes(item))
        .forEach((item) => {
          entity.eatBerry(item, undefined, true)
        })
    })
  ],
  RAGE_CANDY_BAR: [
    new OnSpawnEffect((entity) => {
      entity.applyStat(Stat.ATK, 10)
    })
  ],
  ROCK_SALT: [
    new OnSpawnEffect((entity) => {
      entity.status.triggerRuneProtect(8000)
    })
  ],
  SANDWICH: [
    new OnSpawnEffect((entity) => {
      entity.types.forEach((type) => {
        switch (type) {
          case Synergy.GRASS:
          case Synergy.MONSTER:
          case Synergy.GOURMET:
          case Synergy.BUG:
          case Synergy.AMORPHOUS:
            entity.applyStat(Stat.HP, 20)
            break
          case Synergy.NORMAL:
          case Synergy.ARTIFICIAL:
          case Synergy.DRAGON:
          case Synergy.BABY:
            entity.addShield(30, entity, 0, false)
            break
          case Synergy.FIRE:
          case Synergy.STEEL:
          case Synergy.FOSSIL:
            entity.applyStat(Stat.ATK, 5)
            break
          case Synergy.FLYING:
          case Synergy.GHOST:
            entity.addDodgeChance(5, entity, 0, false)
            break
          case Synergy.ELECTRIC:
          case Synergy.FIELD:
          case Synergy.WILD:
            entity.applyStat(Stat.SPEED, 10)
            break
          case Synergy.ICE:
          case Synergy.AQUATIC:
          case Synergy.FLORA:
            entity.applyStat(Stat.SPE_DEF, 5)
            break
          case Synergy.GROUND:
          case Synergy.FIGHTING:
          case Synergy.ROCK:    
            entity.applyStat(Stat.DEF, 5)
            break
          case Synergy.PSYCHIC:
          case Synergy.HUMAN:
          case Synergy.LIGHT:
            entity.applyStat(Stat.AP, 20)
            break
          case Synergy.FAIRY:
          case Synergy.DARK:
            entity.applyStat(Stat.CRIT_CHANCE, 5)
            entity.applyStat(Stat.CRIT_POWER, 10)
            break
          case Synergy.WATER:
          case Synergy.SOUND:
            entity.applyStat(Stat.PP, 20)
            break
        }
      })
    })
  ],
  SMOKED_FILET: [
    new OnSpawnEffect((entity) => {
      entity.applyStat(Stat.HP, -10, entity, 0, false, true)
      entity.applyStat(Stat.ATK, 3, entity, 0, false, true)
      entity.applyStat(Stat.AP, 5, entity, 0, false, true)
    })
  ],
  SPINDA_COCKTAIL: [
    new OnSpawnEffect((entity) => {
      if (chance(0.8, entity)) {
        entity.applyStat(Stat.ATK, 5)
      }
      if (chance(0.8, entity)) {
        entity.applyStat(Stat.SPEED, 25)
      }
      if (chance(0.8, entity)) {
        entity.applyStat(Stat.AP, 25)
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
  SIRUPY_APPLE: [
    new OnHitEffect((entity, target, board) => {
      if (chance(0.3, entity)) {
        target.status.triggerParalysis(3000, target, entity)
      }
    })
  ],
  SWEET_APPLE: [
    new OnHitEffect((entity, target, board) => {
      target.applyStat(Stat.SPE_DEF, -2)
    })
  ],
  TART_APPLE: [
    new OnHitEffect((entity, target, board) => {
      target.applyStat(Stat.DEF, -2)
    })
  ],
  SWEET_HERB: [
    new OnSpawnEffect((entity) => {
      entity.applyStat(Stat.AP, 80)
    })
  ],
  TEA: [
    new OnSpawnEffect((entity) => {
      entity.applyStat(Stat.PP, 80)
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
  ],
  SWEETS: [],
  STRAWBERRY_SWEET: [
    new OnSpawnEffect((entity) => {
      entity.applyStat(Stat.ATK, 3, entity, 0, false, true)
    })
  ],
  LOVE_SWEET: [
    new OnSpawnEffect((entity) => {
      entity.applyStat(Stat.DEF, 3, entity, 0, false, true)
    })
  ],
  BERRY_SWEET: [
    new OnSpawnEffect((entity) => {
      entity.applyStat(Stat.HP, 10, entity, 0, false, true)
    })
  ],
  CLOVER_SWEET: [
    new OnSpawnEffect((entity) => {
      entity.applyStat(Stat.LUCK, 10, entity, 0, false, true)
    })
  ],
  FLOWER_SWEET: [
    new OnSpawnEffect((entity) => {
      entity.applyStat(Stat.SPEED, 5, entity, 0, false, true)
    })
  ],
  STAR_SWEET: [
    new OnSpawnEffect((entity) => {
      entity.applyStat(Stat.AP, 5, entity, 0, false, true)
    })
  ],
  RIBBON_SWEET: [
    new OnSpawnEffect((entity) => {
      entity.applyStat(Stat.SPE_DEF, 3, entity, 0, false, true)
    })
  ]
}
