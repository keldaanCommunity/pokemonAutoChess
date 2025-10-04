import { EffectEnum } from "../types/enum/Effect"
import { Berries, Dishes, Item } from "../types/enum/Item"
import { Pkm } from "../types/enum/Pokemon"
import { Synergy } from "../types/enum/Synergy"
import { max, min } from "../utils/number"
import { chance } from "../utils/random"
import { values } from "../utils/schemas"
import { AbilityStrategies } from "./abilities/abilities"
import {
  Effect,
  OnDishConsumedEffect,
  OnHitEffect,
  OnSpawnEffect,
  PeriodicEffect
} from "./effects/effect"

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
  [Pkm.CHERUBI]: Item.HERBA_MYSTICA,
  [Pkm.CHERRIM]: Item.HERBA_MYSTICA,
  [Pkm.CHERRIM_SUNLIGHT]: Item.HERBA_MYSTICA,
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
  [Pkm.VELUZA]: Item.SMOKED_FILET,
  [Pkm.SMOLIV]: Item.OLIVE_OIL,
  [Pkm.DOLLIV]: Item.OLIVE_OIL,
  [Pkm.ARBOLIVA]: Item.OLIVE_OIL,
  [Pkm.DEERLING_SUMMER]: Item.TEA,
  [Pkm.SAWSBUCK_SUMMER]: Item.TEA
}

export const DishEffects: Record<(typeof Dishes)[number], Effect[]> = {
  BERRIES: [],
  BERRY_JUICE: [
    new OnSpawnEffect((entity) => {
      entity.addShield(100, entity, 0, false)
      entity.effects.add(EffectEnum.BERRY_JUICE)
    })
  ],
  BINDING_MOCHI: [
    new OnSpawnEffect((entity) => {
      entity.effects.add(EffectEnum.BINDING_MOCHI)
    }),
    new OnHitEffect(({ attacker, target }) => {
      if (attacker.effects.has(EffectEnum.BINDING_MOCHI)) {
        target.status.triggerPossessed(5000, target, attacker)
        attacker.effects.delete(EffectEnum.BINDING_MOCHI)
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
            Item.BLACK_SLUDGE,
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
    new OnHitEffect(({ attacker, target }) => {
      if (attacker.effects.has(EffectEnum.CASTELIACONE)) {
        target.status.triggerFreeze(5000, target)
        attacker.effects.delete(EffectEnum.CASTELIACONE)
      }
    })
  ],
  CURRY: [
    new OnSpawnEffect((entity) => {
      entity.status.triggerRage(4000, entity)
    })
  ],
  FRUIT_JUICE: [
    new OnSpawnEffect((entity) => {
      entity.addSpeed(50, entity, 0, false)
    })
  ],
  HEARTY_STEW: [
    new OnSpawnEffect((entity) => {
      entity.addMaxHP(0.3 * entity.baseHP, entity, 0, false)
      if (entity.items.has(Item.COOKING_POT)) {
        entity.status.triggerBurn(5000, entity, entity)
      }
    })
  ],
  HERBA_MYSTICA: [],
  HERBA_MYSTICA_SWEET: [
    new OnSpawnEffect((entity) => {
      entity.status.fairyField = true
    })
  ],
  HERBA_MYSTICA_SPICY: [
    new OnSpawnEffect((entity) => {
      entity.status.psychicField = true
    })
  ],
  HERBA_MYSTICA_SOUR: [
    new OnSpawnEffect((entity) => {
      entity.status.electricField = true
    })
  ],
  HERBA_MYSTICA_BITTER: [
    new OnSpawnEffect((entity) => {
      entity.status.grassField = true
    })
  ],
  HERBA_MYSTICA_SALTY: [
    new OnSpawnEffect((entity) => {
      entity.status.triggerRuneProtect(40000)
    })
  ],
  HONEY: [],
  LARGE_LEEK: [
    new OnSpawnEffect((entity) => {
      entity.effects.add(EffectEnum.ABILITY_CRIT)
      entity.addCritPower(100, entity, 0, false)
      if (AbilityStrategies[entity.skill].canCritByDefault) {
        entity.addCritPower(50, entity, 0, false)
      }
    })
  ],
  LEEK: [
    new OnSpawnEffect((entity) => {
      entity.effects.add(EffectEnum.ABILITY_CRIT)
      entity.addCritChance(50, entity, 0, false)
      if (AbilityStrategies[entity.skill].canCritByDefault) {
        entity.addCritPower(50, entity, 0, false)
      }
    })
  ],
  LEFTOVERS: [],
  MOOMOO_MILK: [
    new OnDishConsumedEffect(({ pokemon, entity, isGhostOpponent }) => {
      if (!isGhostOpponent) pokemon.hp += 15
      entity?.addMaxHP(15, entity, 0, false)
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
  OLIVE_OIL: [
    new OnSpawnEffect((entity) => {
      entity.addDodgeChance(0.2, entity, 0, false)
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
      entity.addAttack(10, entity, 0, false)
    })
  ],
  ROCK_SALT: [
    new OnSpawnEffect((entity) => {
      entity.status.triggerRuneProtect(10000)
      entity.addShield(0.15 * entity.hp, entity, 0, false)
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
            entity.addMaxHP(20, entity, 0, false)
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
            entity.addAttack(5, entity, 0, false)
            break
          case Synergy.FLYING:
          case Synergy.GHOST:
            entity.addDodgeChance(0.05, entity, 0, false)
            break
          case Synergy.ELECTRIC:
          case Synergy.FIELD:
          case Synergy.WILD:
            entity.addSpeed(10, entity, 0, false)
            break
          case Synergy.ICE:
          case Synergy.AQUATIC:
          case Synergy.FLORA:
            entity.addSpecialDefense(5, entity, 0, false)
            break
          case Synergy.GROUND:
          case Synergy.FIGHTING:
          case Synergy.ROCK:
            entity.addDefense(5, entity, 0, false)
            break
          case Synergy.PSYCHIC:
          case Synergy.HUMAN:
          case Synergy.LIGHT:
            entity.addAbilityPower(20, entity, 0, false)
            break
          case Synergy.FAIRY:
          case Synergy.DARK:
            entity.addCritChance(5, entity, 0, false)
            entity.addCritPower(10, entity, 0, false)
            break
          case Synergy.WATER:
          case Synergy.SOUND:
            entity.addPP(20, entity, 0, false)
            break
        }
      })
    })
  ],
  SMOKED_FILET: [
    new OnDishConsumedEffect(({ pokemon, entity, isGhostOpponent }) => {
      if (!isGhostOpponent) {
        pokemon.hp = min(1)(pokemon.hp - 5)
        pokemon.atk += 5
        pokemon.ap += 10
      }
      if (entity) {
        entity.addMaxHP(-5, entity, 0, false)
        entity.addAttack(5, entity, 0, false)
        entity.addAbilityPower(10, entity, 0, false)
      }
    })
  ],
  SPINDA_COCKTAIL: [
    new OnSpawnEffect((entity) => {
      if (chance(0.8, entity)) {
        entity.addAttack(10, entity, 0, false)
      }
      if (chance(0.8, entity)) {
        entity.addSpeed(50, entity, 0, false)
      }
      if (chance(0.8, entity)) {
        entity.addAbilityPower(50, entity, 0, false)
      }
      if (chance(0.8, entity)) {
        entity.addShield(100, entity, 0, false)
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
    new OnHitEffect(({ attacker, target }) => {
      if (chance(0.3, attacker)) {
        target.status.triggerParalysis(3000, target, attacker)
      }
    })
  ],
  SWEET_APPLE: [
    new OnHitEffect(({ attacker, target }) => {
      target.addSpecialDefense(-2, attacker, 0, false)
    })
  ],
  TART_APPLE: [
    new OnHitEffect(({ attacker, target }) => {
      target.addDefense(-2, attacker, 0, false)
    })
  ],
  TEA: [
    new OnSpawnEffect((entity) => {
      entity.addPP(80, entity, 0, false)
    })
  ],
  WHIPPED_DREAM: [
    new OnSpawnEffect((entity) => {
      entity.effects.add(EffectEnum.WHIPPED_DREAM)
    }),
    new OnHitEffect(({ attacker, target }) => {
      if (attacker.effects.has(EffectEnum.WHIPPED_DREAM)) {
        target.status.triggerCharm(5000, target, attacker)
        attacker.effects.delete(EffectEnum.WHIPPED_DREAM)
      }
    })
  ],
  SWEETS: [],
  STRAWBERRY_SWEET: [
    new OnDishConsumedEffect(({ pokemon, entity, isGhostOpponent }) => {
      if (!isGhostOpponent) pokemon.atk += 3
      entity?.addAttack(3, entity, 0, false)
    })
  ],
  LOVE_SWEET: [
    new OnDishConsumedEffect(({ pokemon, entity, isGhostOpponent }) => {
      if (!isGhostOpponent) pokemon.def += 3
      entity?.addDefense(3, entity, 0, false)
    })
  ],
  BERRY_SWEET: [
    new OnDishConsumedEffect(({ pokemon, entity, isGhostOpponent }) => {
      if (!isGhostOpponent) pokemon.hp += 15
      entity?.addMaxHP(15, entity, 0, false)
    })
  ],
  CLOVER_SWEET: [
    new OnDishConsumedEffect(({ pokemon, entity, isGhostOpponent }) => {
      if (!isGhostOpponent) pokemon.luck = max(100)(pokemon.luck + 10)
      entity?.addLuck(10, entity, 0, false)
    })
  ],
  FLOWER_SWEET: [
    new OnDishConsumedEffect(({ pokemon, entity, isGhostOpponent }) => {
      if (!isGhostOpponent) pokemon.speed = max(300)(pokemon.speed + 5)
      entity?.addSpeed(5, entity, 0, false)
    })
  ],
  STAR_SWEET: [
    new OnDishConsumedEffect(({ pokemon, entity, isGhostOpponent }) => {
      if (!isGhostOpponent) pokemon.ap += 10
      entity?.addAbilityPower(10, entity, 0, false)
    })
  ],
  RIBBON_SWEET: [
    new OnDishConsumedEffect(({ pokemon, entity, isGhostOpponent }) => {
      if (!isGhostOpponent) pokemon.speDef += 3
      entity?.addSpecialDefense(3, entity, 0, false)
    })
  ]
}
