import { FIGHTING_PHASE_DURATION, getBaseAltForm } from "../../config"
import { ItemConfigs, ItemStats } from "../../config/game/items"
import { Title } from "../../types"
import { EffectEnum } from "../../types/enum/Effect"
import { Stat } from "../../types/enum/Game"
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
      entity.addShield(ItemConfigs.BERRY_JUICE.shield, entity, 0, false)
      entity.effects.add(EffectEnum.BERRY_JUICE)
    })
  ],
  [Item.BIG_MUSHROOM]: [
    new OnSpawnEffect((entity) => {
      entity.addMaxHP(
        (ItemConfigs.BIG_MUSHROOM.maxHpBonusPercent / 100) * entity.baseHP,
        entity,
        0,
        false
      )
    })
  ],
  [Item.BALM_MUSHROOM]: [
    new OnSpawnEffect((entity) => {
      const { safeguardDurationSeconds, speed, healPercent, intervalSeconds } =
        ItemConfigs.BALM_MUSHROOM
      entity.status.triggerRuneProtect(
        safeguardDurationSeconds * 1000,
        entity,
        entity
      )
      entity.addSpeed(speed, entity, 0, false)
      entity.effects.add(EffectEnum.BALM_MUSHROOM)
      entity.effectsSet.add(
        new PeriodicEffect(
          (entity) => {
            entity.handleHeal(
              (healPercent / 100) * entity.maxHP,
              entity,
              0,
              false
            )
          },
          Item.BALM_MUSHROOM,
          intervalSeconds * 1000
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
        target.status.triggerPossessed(
          ItemConfigs.BINDING_MOCHI.durationSeconds * 1000,
          target,
          attacker
        )
        attacker.effects.delete(EffectEnum.BINDING_MOCHI)
      }
    })
  ],
  [Item.BLACK_SLUDGE]: [
    new OnSpawnEffect((entity) => {
      const { healPercent, intervalSeconds, selfPoisonDurationSeconds } =
        ItemConfigs.BLACK_SLUDGE
      entity.effects.add(EffectEnum.BLACK_SLUDGE)
      if (entity.types.has(Synergy.POISON)) {
        entity.effectsSet.add(
          new PeriodicEffect(
            (entity) => {
              entity.handleHeal(
                (healPercent / 100) * entity.maxHP,
                entity,
                0,
                false
              )
            },
            Item.BLACK_SLUDGE,
            intervalSeconds * 1000
          )
        )
      } else {
        entity.status.triggerPoison(
          selfPoisonDurationSeconds * 1000,
          entity,
          entity
        )
      }
    }),
    new OnHitEffect(({ attacker, target }) => {
      if (
        attacker.effects.has(EffectEnum.BLACK_SLUDGE) ||
        chance(ItemConfigs.BLACK_SLUDGE.effectChance.value / 100, attacker)
      ) {
        target.status.triggerPoison(
          ItemConfigs.BLACK_SLUDGE.durationSeconds * 1000,
          target,
          attacker
        )
        attacker.effects.delete(EffectEnum.BLACK_SLUDGE)
      }
    })
  ],
  [Item.CASTELIACONE]: [
    new OnSpawnEffect((entity) => {
      entity.effects.add(EffectEnum.CASTELIACONE)
    }),
    new OnHitEffect(({ attacker, target }) => {
      if (
        attacker.effects.has(EffectEnum.CASTELIACONE) ||
        chance(ItemConfigs.CASTELIACONE.effectChance.value / 100, attacker)
      ) {
        target.status.triggerFreeze(
          ItemConfigs.CASTELIACONE.durationSeconds * 1000,
          target,
          attacker
        )
        attacker.effects.delete(EffectEnum.CASTELIACONE)
      }
    })
  ],
  [Item.CURRY]: [
    new OnSpawnEffect((entity) => {
      entity.status.triggerRage(
        ItemConfigs.CURRY.durationSeconds * 1000,
        entity
      )
    })
  ],
  [Item.FRUIT_JUICE]: [
    new OnSpawnEffect((entity) => {
      entity.addSpeed(ItemConfigs.FRUIT_JUICE.speed, entity, 0, false)
    })
  ],
  [Item.LUCKY_EGG]: [
    new OnSpawnEffect((entity) => {
      const { luck, abilityPower } = ItemConfigs.LUCKY_EGG
      entity.addLuck(luck, entity, 0, false)
      entity.addAbilityPower(abilityPower, entity, 0, false)
    })
  ],
  [Item.HEARTY_STEW]: [
    new OnSpawnEffect((entity) => {
      const { maxHpBonusPercent, burnDurationSeconds } = ItemConfigs.HEARTY_STEW
      entity.addMaxHP(
        (maxHpBonusPercent / 100) * entity.baseHP,
        entity,
        0,
        false
      )
      if (entity.items.has(Item.COOKING_POT)) {
        entity.status.triggerBurn(burnDurationSeconds * 1000, entity, entity)
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
      const { critPower, abilityCritPower } = ItemConfigs.LARGE_LEEK
      entity.addCritPower(critPower, entity, 0, false)
      if (AbilityStrategies[entity.skill].canCritByDefault) {
        entity.addCritPower(abilityCritPower, entity, 0, false)
      }
    })
  ],
  [Item.LEEK]: [
    new OnSpawnEffect((entity) => {
      entity.effects.add(EffectEnum.ABILITY_CRIT)
      const { critChance, abilityCritPower } = ItemConfigs.LEEK
      entity.addCritChance(critChance, entity, 0, false)
      if (AbilityStrategies[entity.skill].canCritByDefault) {
        entity.addCritPower(abilityCritPower, entity, 0, false)
      }
    })
  ],
  [Item.LEFTOVERS]: [],
  [Item.MOOMOO_MILK]: [
    new OnDishConsumedEffect(({ entity }) => {
      entity?.addMaxHP(ItemConfigs.MOOMOO_MILK.maxHp, entity, 0, false, true)
    })
  ],
  [Item.MUSHROOMS]: [],
  [Item.NUTRITIOUS_EGG]: [
    new OnSpawnEffect((entity) => {
      const factor = ItemConfigs.NUTRITIOUS_EGG.baseStatBonusPercent / 100
      entity.addAttack(factor * entity.baseAtk, entity, 0, false)
      entity.addDefense(factor * entity.baseDef, entity, 0, false)
      entity.addSpecialDefense(factor * entity.baseSpeDef, entity, 0, false)
    })
  ],
  [Item.OLIVE_OIL]: [
    new OnSpawnEffect((entity) => {
      entity.addDodgeChance(
        ItemConfigs.OLIVE_OIL.dodgeChancePercent.value / 100,
        entity,
        0,
        false
      )
    })
  ],
  [Item.POFFIN]: [
    new OnSpawnEffect((entity) => {
      entity.addShield(ItemConfigs.POFFIN.shield, entity, 0, false)

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
      entity.addAttack(ItemConfigs.RAGE_CANDY_BAR.attack, entity, 0, false)
    })
  ],
  [Item.ROCK_SALT]: [
    new OnSpawnEffect((entity) => {
      const { safeguardDurationSeconds, shieldPercent } = ItemConfigs.ROCK_SALT
      entity.status.triggerRuneProtect(
        safeguardDurationSeconds * 1000,
        entity,
        entity
      )
      entity.addShield((shieldPercent / 100) * entity.maxHP, entity, 0, false)
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
            entity.addMaxHP(ItemConfigs.SANDWICH.maxHp, entity, 0, false)
            break
          case Synergy.NORMAL:
          case Synergy.ARTIFICIAL:
          case Synergy.DRAGON:
          case Synergy.BABY:
            entity.addShield(ItemConfigs.SANDWICH.shield, entity, 0, false)
            break
          case Synergy.FIRE:
          case Synergy.STEEL:
          case Synergy.FOSSIL:
            entity.addAttack(ItemConfigs.SANDWICH.attack, entity, 0, false)
            break
          case Synergy.FLYING:
          case Synergy.GHOST:
            entity.addDodgeChance(
              ItemConfigs.SANDWICH.dodgeChancePercent / 100,
              entity,
              0,
              false
            )
            break
          case Synergy.ELECTRIC:
          case Synergy.FIELD:
          case Synergy.WILD:
            entity.addSpeed(ItemConfigs.SANDWICH.speed, entity, 0, false)
            break
          case Synergy.ICE:
          case Synergy.AQUATIC:
          case Synergy.FLORA:
            entity.addSpecialDefense(
              ItemConfigs.SANDWICH.specialDefense,
              entity,
              0,
              false
            )
            break
          case Synergy.GROUND:
          case Synergy.FIGHTING:
          case Synergy.ROCK:
            entity.addDefense(ItemConfigs.SANDWICH.defense, entity, 0, false)
            break
          case Synergy.PSYCHIC:
          case Synergy.HUMAN:
          case Synergy.LIGHT:
            entity.addAbilityPower(
              ItemConfigs.SANDWICH.abilityPower,
              entity,
              0,
              false
            )
            break
          case Synergy.FAIRY:
          case Synergy.DARK:
            entity.addCritChance(
              ItemConfigs.SANDWICH.critChance,
              entity,
              0,
              false
            )
            entity.addCritPower(
              ItemConfigs.SANDWICH.critPower,
              entity,
              0,
              false
            )
            break
          case Synergy.WATER:
          case Synergy.SOUND:
            entity.addPP(ItemConfigs.SANDWICH.pp, entity, 0, false)
            break
        }
      })
    })
  ],
  [Item.SMOKED_FILET]: [
    new OnDishConsumedEffect(({ pokemon, entity, player }) => {
      if (entity) {
        const { maxHpCost, attack, abilityPower } = ItemConfigs.SMOKED_FILET
        entity.addMaxHP(-maxHpCost, entity, 0, false, true)
        entity.addAttack(attack, entity, 0, false, true)
        entity.addAbilityPower(abilityPower, entity, 0, false, true)
      }
    })
  ],
  [Item.SPINDA_COCKTAIL]: [
    new OnSpawnEffect((entity) => {
      const {
        positiveChance,
        attack,
        speed,
        abilityPower,
        shield,
        durationSeconds
      } = ItemConfigs.SPINDA_COCKTAIL
      if (chance(positiveChance.value / 100, entity)) {
        entity.addAttack(attack, entity, 0, false)
      }
      if (chance(positiveChance.value / 100, entity)) {
        entity.addSpeed(speed, entity, 0, false)
      }
      if (chance(positiveChance.value / 100, entity)) {
        entity.addAbilityPower(abilityPower, entity, 0, false)
      }
      if (chance(positiveChance.value / 100, entity)) {
        entity.addShield(shield, entity, 0, false)
      }

      if (!chance(positiveChance.value / 100, entity)) {
        entity.status.triggerConfusion(durationSeconds * 1000, entity, entity)
      } else if (!chance(positiveChance.value / 100, entity)) {
        entity.status.triggerBlinded(durationSeconds * 1000, entity, entity)
      } else if (!chance(positiveChance.value / 100, entity)) {
        entity.status.triggerSleep(durationSeconds * 1000, entity)
      }
    })
  ],
  [Item.SIRUPY_APPLE]: [
    new OnHitEffect(({ attacker, target }) => {
      const { effectChance, durationSeconds } = ItemConfigs.SIRUPY_APPLE
      if (chance(effectChance.value / 100, attacker)) {
        target.status.triggerParalysis(durationSeconds * 1000, target, attacker)
      }
    })
  ],
  [Item.SWEET_APPLE]: [
    new OnHitEffect(({ attacker, target }) => {
      target.addSpecialDefense(
        -ItemConfigs.SWEET_APPLE.specialDefenseReduction,
        attacker,
        0,
        false
      )
    })
  ],
  [Item.TART_APPLE]: [
    new OnHitEffect(({ attacker, target }) => {
      target.addDefense(
        -ItemConfigs.TART_APPLE.defenseReduction,
        attacker,
        0,
        false
      )
    })
  ],
  [Item.TEA]: [
    new OnSpawnEffect((entity) => {
      entity.addPP(ItemConfigs.TEA.pp, entity, 0, false)
    })
  ],
  [Item.TINY_MUSHROOM]: [
    new OnSpawnEffect((entity) => {
      const { maxHpReductionPercent, speed } = ItemConfigs.TINY_MUSHROOM
      entity.addMaxHP(
        -(maxHpReductionPercent / 100) * entity.baseHP,
        entity,
        0,
        false
      )
      entity.addSpeed(speed, entity, 0, false)
    })
  ],
  [Item.WHIPPED_DREAM]: [
    new OnSpawnEffect((entity) => {
      entity.effects.add(EffectEnum.WHIPPED_DREAM)
    }),
    new OnHitEffect(({ attacker, target }) => {
      if (
        attacker.effects.has(EffectEnum.WHIPPED_DREAM) ||
        chance(ItemConfigs.WHIPPED_DREAM.effectChance.value / 100, attacker)
      ) {
        target.status.triggerCharm(
          ItemConfigs.WHIPPED_DREAM.durationSeconds * 1000,
          target,
          attacker
        )
        attacker.effects.delete(EffectEnum.WHIPPED_DREAM)
      }
    })
  ],
  [Item.SWEETS]: [],
  [Item.STRAWBERRY_SWEET]: [
    new OnDishConsumedEffect(({ pokemon, entity, player }) => {
      entity?.addAttack(
        ItemConfigs.STRAWBERRY_SWEET.attack,
        entity,
        0,
        false,
        true
      )
    })
  ],
  [Item.LOVE_SWEET]: [
    new OnDishConsumedEffect(({ pokemon, entity, player }) => {
      entity?.addDefense(ItemConfigs.LOVE_SWEET.defense, entity, 0, false, true)
    })
  ],
  [Item.BERRY_SWEET]: [
    new OnDishConsumedEffect(({ pokemon, entity, player }) => {
      entity?.addMaxHP(ItemConfigs.BERRY_SWEET.maxHp, entity, 0, false, true)
    })
  ],
  [Item.CLOVER_SWEET]: [
    new OnDishConsumedEffect(({ pokemon, entity, player }) => {
      entity?.addLuck(ItemConfigs.CLOVER_SWEET.luck, entity, 0, false, true)
    })
  ],
  [Item.FLOWER_SWEET]: [
    new OnDishConsumedEffect(({ pokemon, entity, player }) => {
      entity?.addSpeed(ItemConfigs.FLOWER_SWEET.speed, entity, 0, false, true)
    })
  ],
  [Item.STAR_SWEET]: [
    new OnDishConsumedEffect(({ pokemon, entity, player }) => {
      entity?.addAbilityPower(
        ItemConfigs.STAR_SWEET.abilityPower,
        entity,
        0,
        false,
        true
      )
    })
  ],
  [Item.RIBBON_SWEET]: [
    new OnDishConsumedEffect(({ pokemon, entity, player }) => {
      entity?.addSpecialDefense(
        ItemConfigs.RIBBON_SWEET.specialDefense,
        entity,
        0,
        false,
        true
      )
    })
  ],
  [Item.RICE]: [
    new OnDishConsumedEffect(({ pokemon, entity, player }) => {
      entity?.addMaxHP(ItemConfigs.RICE.maxHp, entity, 0, false)
      entity?.effects.add(EffectEnum.RICE)
      if (!player) return
      const tatsugiriOnBoard = schemaValues(player.board).find(
        (e) => e && getBaseAltForm(e.name) === Pkm.TATSUGIRI_CURLY
      )
      if (tatsugiriOnBoard?.name === Pkm.TATSUGIRI_CURLY) {
        entity?.addAttack(ItemStats.TATSUGIRI_CURLY[Stat.ATK], entity, 0, false)
      } else if (tatsugiriOnBoard?.name === Pkm.TATSUGIRI_DROOPY) {
        entity?.addDefense(
          ItemStats.TATSUGIRI_DROOPY[Stat.DEF],
          entity,
          0,
          false
        )
      } else if (tatsugiriOnBoard?.name === Pkm.TATSUGIRI_STRETCHY) {
        entity?.addSpeed(
          ItemStats.TATSUGIRI_STRETCHY[Stat.SPEED],
          entity,
          0,
          false
        )
      }
    })
  ]
}
