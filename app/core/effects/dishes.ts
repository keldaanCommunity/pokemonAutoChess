import { FIGHTING_PHASE_DURATION, getBaseAltForm } from "../../config"
import { Title } from "../../types"
import { EffectEnum } from "../../types/enum/Effect"
import { Berries, type Dishes, Item } from "../../types/enum/Item"
import { Pkm } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { chance } from "../../utils/random"
import { schemaValues } from "../../utils/schemas"
import { AbilityStrategies } from "./../abilities/abilities"
import {
  type Effect,
  OnDishConsumedEffect,
  OnHitEffect,
  OnSpawnEffect,
  PeriodicEffect
} from "./../effects/effect"

export const DishEffects: Record<(typeof Dishes)[number], Effect[]> = {
  [Item.BERRY_JUICE]: [
    new OnSpawnEffect((entity) => {
      entity.addShield(100, entity, 0, false)
      entity.effects.add(EffectEnum.BERRY_JUICE)
    })
  ],
  [Item.BIG_MUSHROOM]: [
    new OnSpawnEffect((entity) => {
      entity.addMaxHP(0.3 * entity.baseHP, entity, 0, false)
    })
  ],
  [Item.BALM_MUSHROOM]: [
    new OnSpawnEffect((entity) => {
      entity.status.triggerRuneProtect(30000, entity, entity)
      entity.addSpeed(30, entity, 0, false)
      entity.effects.add(EffectEnum.BALM_MUSHROOM)
      entity.effectsSet.add(
        new PeriodicEffect(
          (entity) => {
            entity.handleHeal(0.1 * entity.maxHP, entity, 0, false)
          },
          Item.BALM_MUSHROOM,
          1000
        )
      )
    })
  ],
  [Item.BERRIES]: [],
  [Item.BINDING_MOCHI]: [
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
  [Item.BLACK_SLUDGE]: [
    new OnSpawnEffect((entity) => {
      if (entity.types.has(Synergy.POISON)) {
        entity.effectsSet.add(
          new PeriodicEffect(
            (entity) => {
              entity.handleHeal(0.05 * entity.maxHP, entity, 0, false)
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
  [Item.CASTELIACONE]: [
    new OnSpawnEffect((entity) => {
      entity.effects.add(EffectEnum.CASTELIACONE)
    }),
    new OnHitEffect(({ attacker, target }) => {
      if (attacker.effects.has(EffectEnum.CASTELIACONE)) {
        target.status.triggerFreeze(5000, target, attacker)
        attacker.effects.delete(EffectEnum.CASTELIACONE)
      }
    })
  ],
  [Item.CURRY]: [
    new OnSpawnEffect((entity) => {
      entity.status.triggerRage(3000, entity)
    })
  ],
  [Item.FRUIT_JUICE]: [
    new OnSpawnEffect((entity) => {
      entity.addSpeed(50, entity, 0, false)
    })
  ],
  [Item.HEARTY_STEW]: [
    new OnSpawnEffect((entity) => {
      entity.addMaxHP(0.3 * entity.baseHP, entity, 0, false)
      if (entity.items.has(Item.COOKING_POT)) {
        entity.status.triggerBurn(5000, entity, entity)
      }
    })
  ],
  [Item.HERBA_MYSTICA]: [],
  [Item.HERBA_MYSTICA_SWEET]: [
    new OnSpawnEffect((entity) => {
      entity.status.addFairyField(entity)
    })
  ],
  [Item.HERBA_MYSTICA_SPICY]: [
    new OnSpawnEffect((entity) => {
      entity.status.addPsychicField(entity)
    })
  ],
  [Item.HERBA_MYSTICA_SOUR]: [
    new OnSpawnEffect((entity) => {
      entity.status.addElectricField(entity)
    })
  ],
  [Item.HERBA_MYSTICA_BITTER]: [
    new OnSpawnEffect((entity) => {
      entity.status.addGrassField(entity)
    })
  ],
  [Item.HERBA_MYSTICA_SALTY]: [
    new OnSpawnEffect((entity) => {
      entity.status.triggerRuneProtect(FIGHTING_PHASE_DURATION, entity, entity)
    })
  ],
  [Item.HONEY]: [],
  [Item.LARGE_LEEK]: [
    new OnSpawnEffect((entity) => {
      entity.effects.add(EffectEnum.ABILITY_CRIT)
      entity.addCritPower(100, entity, 0, false)
      if (AbilityStrategies[entity.skill].canCritByDefault) {
        entity.addCritPower(50, entity, 0, false)
      }
    })
  ],
  [Item.LEEK]: [
    new OnSpawnEffect((entity) => {
      entity.effects.add(EffectEnum.ABILITY_CRIT)
      entity.addCritChance(50, entity, 0, false)
      if (AbilityStrategies[entity.skill].canCritByDefault) {
        entity.addCritPower(50, entity, 0, false)
      }
    })
  ],
  [Item.LEFTOVERS]: [],
  [Item.MOOMOO_MILK]: [
    new OnDishConsumedEffect(({ entity }) => {
      entity?.addMaxHP(15, entity, 0, false, true)
    })
  ],
  [Item.MUSHROOMS]: [],
  [Item.NUTRITIOUS_EGG]: [
    new OnSpawnEffect((entity) => {
      // Start the next fight with +50% base ATK, DEF, SPE_DEF and AP
      entity.addAttack(0.5 * entity.baseAtk, entity, 0, false)
      entity.addDefense(0.5 * entity.baseDef, entity, 0, false)
      entity.addSpecialDefense(0.5 * entity.baseSpeDef, entity, 0, false)
    })
  ],
  [Item.OLIVE_OIL]: [
    new OnSpawnEffect((entity) => {
      entity.addDodgeChance(0.2, entity, 0, false)
    })
  ],
  [Item.POFFIN]: [
    new OnSpawnEffect((entity) => {
      entity.addShield(100, entity, 0, false)

      if (
        entity.player &&
        entity.items.has(Item.GOLDEN_NANAB_BERRY) &&
        entity.items.has(Item.GOLDEN_PINAP_BERRY) &&
        entity.items.has(Item.GOLDEN_RAZZ_BERRY)
      ) {
        entity.player.titles.add(Title.POFFIN_MASTER)
      }

      schemaValues(entity.items)
        .filter((item) => Berries.includes(item))
        .forEach((item) => {
          entity.eatBerry(item, undefined, true, 0, false)
        })
    })
  ],
  [Item.RAGE_CANDY_BAR]: [
    new OnSpawnEffect((entity) => {
      entity.addAttack(10, entity, 0, false)
    })
  ],
  [Item.ROCK_SALT]: [
    new OnSpawnEffect((entity) => {
      entity.status.triggerRuneProtect(10000, entity, entity)
      entity.addShield(0.15 * entity.maxHP, entity, 0, false)
    })
  ],
  [Item.SANDWICH]: [
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
  [Item.SMOKED_FILET]: [
    new OnDishConsumedEffect(({ pokemon, entity, player }) => {
      if (entity) {
        entity.addMaxHP(-5, entity, 0, false, true)
        entity.addAttack(3, entity, 0, false, true)
        entity.addAbilityPower(10, entity, 0, false, true)
      }
    })
  ],
  [Item.SPINDA_COCKTAIL]: [
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
  [Item.SIRUPY_APPLE]: [
    new OnHitEffect(({ attacker, target }) => {
      if (chance(0.3, attacker)) {
        target.status.triggerParalysis(3000, target, attacker)
      }
    })
  ],
  [Item.SWEET_APPLE]: [
    new OnHitEffect(({ attacker, target }) => {
      target.addSpecialDefense(-2, attacker, 0, false)
    })
  ],
  [Item.TART_APPLE]: [
    new OnHitEffect(({ attacker, target }) => {
      target.addDefense(-2, attacker, 0, false)
    })
  ],
  [Item.TEA]: [
    new OnSpawnEffect((entity) => {
      entity.addPP(60, entity, 0, false)
    })
  ],
  [Item.TINY_MUSHROOM]: [
    new OnSpawnEffect((entity) => {
      entity.addMaxHP(-0.3 * entity.baseHP, entity, 0, false)
      entity.addSpeed(30, entity, 0, false)
    })
  ],
  [Item.WHIPPED_DREAM]: [
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
  [Item.SWEETS]: [],
  [Item.STRAWBERRY_SWEET]: [
    new OnDishConsumedEffect(({ pokemon, entity, player }) => {
      entity?.addAttack(3, entity, 0, false, true)
    })
  ],
  [Item.LOVE_SWEET]: [
    new OnDishConsumedEffect(({ pokemon, entity, player }) => {
      entity?.addDefense(3, entity, 0, false, true)
    })
  ],
  [Item.BERRY_SWEET]: [
    new OnDishConsumedEffect(({ pokemon, entity, player }) => {
      entity?.addMaxHP(15, entity, 0, false, true)
    })
  ],
  [Item.CLOVER_SWEET]: [
    new OnDishConsumedEffect(({ pokemon, entity, player }) => {
      entity?.addLuck(10, entity, 0, false, true)
    })
  ],
  [Item.FLOWER_SWEET]: [
    new OnDishConsumedEffect(({ pokemon, entity, player }) => {
      entity?.addSpeed(10, entity, 0, false, true)
    })
  ],
  [Item.STAR_SWEET]: [
    new OnDishConsumedEffect(({ pokemon, entity, player }) => {
      entity?.addAbilityPower(10, entity, 0, false, true)
    })
  ],
  [Item.RIBBON_SWEET]: [
    new OnDishConsumedEffect(({ pokemon, entity, player }) => {
      entity?.addSpecialDefense(3, entity, 0, false, true)
    })
  ],
  [Item.RICE]: [
    new OnDishConsumedEffect(({ pokemon, entity, player }) => {
      entity?.addShield(80, entity, 0, false)
      if (!player) return
      const tatsugiriOnBoard = schemaValues(player.board).find(
        (e) => e && getBaseAltForm(e.name) === Pkm.TATSUGIRI_CURLY
      )
      if (tatsugiriOnBoard?.name === Pkm.TATSUGIRI_CURLY) {
        entity?.addAttack(8, entity, 0, false)
      } else if (tatsugiriOnBoard?.name === Pkm.TATSUGIRI_DROOPY) {
        entity?.addDefense(8, entity, 0, false)
      } else if (tatsugiriOnBoard?.name === Pkm.TATSUGIRI_STRETCHY) {
        entity?.addSpeed(25, entity, 0, false)
      }
    })
  ]
}
