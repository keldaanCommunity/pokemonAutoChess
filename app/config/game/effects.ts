import { EffectEnum } from "../../types/enum/Effect"
import { Status } from "../../types/enum/Status"
import { Weather } from "../../types/enum/Weather"
import type { BalanceConfig } from "./balance"
import { SellPrices } from "./shop"
import { StatusConfigs } from "./statuses"
import { WeatherConfigs } from "./weathers"

export const EffectConfigs = {
  [EffectEnum.STAMINA]: { shield: 15 },
  [EffectEnum.STRENGTH]: { shield: 20 },
  [EffectEnum.ENDURE]: { shield: 25 },
  [EffectEnum.PURE_POWER]: {
    shield: 30,
    baseAttackBonusPercent: 30,
    abilityPower: 30
  },
  [EffectEnum.INGRAIN]: { heal: 5, interval: 2 },
  [EffectEnum.GROWTH]: { heal: 15, interval: 2 },
  [EffectEnum.SPORE]: { heal: 25, interval: 2 },
  [EffectEnum.OVERGROW]: { abilityPower: 50 },
  [EffectEnum.FLAME_BODY]: {
    burnChance: {
      valuePerTier: [30],
      luckScaling: true
    },
    burnDuration: 3
  },
  [EffectEnum.WILDFIRE]: { attackPerHit: 1 },
  [EffectEnum.BLAZE]: { attackPerHit: 2 },
  [EffectEnum.DESOLATE_LAND]: { attackPerHit: 3, maxFireShards: 1 },
  [EffectEnum.RAIN_DANCE]: { ppPerSecond: 4 },
  [EffectEnum.DRIZZLE]: { ppPerSecond: 8 },
  [EffectEnum.PRIMORDIAL_SEA]: { ppPerSecond: 12 },
  [EffectEnum.RISING_VOLTAGE]: { attackInterval: 4 },
  [EffectEnum.POWER_SURGE]: { attackInterval: 3 },
  [EffectEnum.SUPERCHARGED]: { ppBurn: 10, batteryChargePercent: 5 },
  [EffectEnum.GUTS]: { damageBlocked: 3 },
  [EffectEnum.STURDY]: { damageBlocked: 6 },
  [EffectEnum.DEFIANT]: { damageBlocked: 9 },
  [EffectEnum.COACHING]: {
    damageBlocked: 12,
    trainingAttack: 4,
    trainingMaxHpPercent: 10
  },
  [EffectEnum.PRECOGNITION]: { abilityPower: 50, shopInterval: 5 },
  [EffectEnum.AURA]: { abilityPower: 100, shopInterval: 3 },
  [EffectEnum.TRANSCENDENCE]: { abilityPower: 150, rerollInterval: 10 },
  [EffectEnum.HONE_CLAWS]: { critChancePercent: 30, critPowerPercent: 40 },
  [EffectEnum.ASSURANCE]: { critChancePercent: 40, critPowerPercent: 60 },
  [EffectEnum.BEAT_UP]: { critChancePercent: 50, critPowerPercent: 100 },
  [EffectEnum.STEEL_SURGE]: { trueDamagePercent: 33 },
  [EffectEnum.STEEL_SPIKE]: { trueDamagePercent: 66 },
  [EffectEnum.CORKSCREW_CRASH]: { trueDamagePercent: 100 },
  [EffectEnum.MAX_MELTDOWN]: { trueDamagePercent: 125 },
  [EffectEnum.TILLER]: {
    defensePerDepth: 1,
    maxDefense: 5,
    attackAtMaxDepth: 3
  },
  [EffectEnum.DIGGER]: {
    defensePerDepth: 2,
    maxDefense: 10,
    attackAtMaxDepth: 5
  },
  [EffectEnum.DRILLER]: {
    defensePerDepth: 3,
    maxDefense: 15,
    attackAtMaxDepth: 8
  },
  [EffectEnum.DEEP_MINER]: { defensePerFullRow: 5, attackAtFullBoard: 8 },
  [EffectEnum.POISONOUS]: {
    poisonChance: {
      valuePerTier: [30],
      luckScaling: true
    }
  },
  [EffectEnum.VENOMOUS]: {
    poisonChance: {
      valuePerTier: [60],
      luckScaling: true
    },
    maxStacksBonus: 1
  },
  [EffectEnum.TOXIC]: {
    poisonChance: {
      valuePerTier: [100],
      luckScaling: true
    },
    maxStacksBonus: 2
  },
  [EffectEnum.DRAGON_SCALES]: { shieldPerStar: 5 },
  [EffectEnum.DRAGON_DANCE]: { speedPerStar: 1, abilityPowerPerStar: 1 },
  [EffectEnum.BULK_UP]: { heal: 30, speed: 15 },
  [EffectEnum.RAGE]: { heal: 40, speed: 20 },
  [EffectEnum.ANGER_POINT]: { heal: 50, speed: 25 },
  [EffectEnum.PURSUIT]: {
    flinchChance: {
      valuePerTier: [30],
      luckScaling: true
    },
    attackPerKo: 3,
    abilityPowerPerKo: 10,
    maxHpPerKoPercent: 20
  },
  [EffectEnum.BRUTAL_SWING]: {
    attackPerKo: 6,
    abilityPowerPerKo: 20,
    maxHpPerKoPercent: 40
  },
  [EffectEnum.POWER_TRIP]: {
    attackPerKo: 10,
    abilityPowerPerKo: 30,
    maxHpPerKoPercent: 60
  },
  [EffectEnum.MERCILESS]: { allyHpThreshold: 10 },
  [EffectEnum.MEDITATE]: { lifestealPercent: 25 },
  [EffectEnum.FOCUS_ENERGY]: { lifestealPercent: 35 },
  [EffectEnum.CALM_MIND]: { lifestealPercent: 50 },
  [EffectEnum.SWIFT_SWIM]: {
    statusReductionPercent: 30,
    waveHealPercent: 10,
    waveDamagePercent: 5
  },
  [EffectEnum.HYDRATION]: {
    statusReductionPercent: 50,
    waveHealPercent: 20,
    waveDamagePercent: 10
  },
  [EffectEnum.WATER_VEIL]: {
    statusReductionPercent: 70,
    waveHealPercent: 30,
    waveDamagePercent: 15,
    secondWaveTime: 14
  },
  [EffectEnum.SURGE_SURFER]: { waveInterval: 7 },
  [EffectEnum.COCOON]: { copies: 1 },
  [EffectEnum.INFESTATION]: { copies: 2 },
  [EffectEnum.HORDE]: { copies: 3 },
  [EffectEnum.HEART_OF_THE_SWARM]: { copies: 4 },
  [EffectEnum.TAILWIND]: { hpThresholdPercent: 20 },
  [EffectEnum.FEATHER_DANCE]: { protectDuration: 2 },
  [EffectEnum.MAX_AIRSTREAM]: {
    firstHpThresholdPercent: 50,
    secondHpThresholdPercent: 20
  },
  [EffectEnum.SKYDIVE]: { landingDamagePercent: 150 },
  [EffectEnum.BATTLE_ARMOR]: {
    defense: 10,
    critDamageReductionPercent: 30,
    maxWeatherRocks: 1
  },
  [EffectEnum.MOUTAIN_RESISTANCE]: {
    defense: 25,
    critDamageReductionPercent: 50,
    maxWeatherRocks: 2
  },
  [EffectEnum.DIAMOND_STORM]: {
    defense: 50,
    critDamageReductionPercent: 70,
    maxWeatherRocks: 3
  },
  [EffectEnum.CURSE_OF_VULNERABILITY]: { defenseReduction: 5 },
  [EffectEnum.CURSE_OF_WEAKNESS]: { attackReductionPercent: 20 },
  [EffectEnum.CURSE_OF_TORMENT]: { abilityPowerReduction: 30 },
  [EffectEnum.CURSE_OF_FATE]: { koDelay: 8 },
  [EffectEnum.AROMATIC_MIST]: { wandChoices: 3 },
  [EffectEnum.FAIRY_AURA]: { wandChoices: 3 },
  [EffectEnum.PIXILATE]: { wandChoices: 3 },
  [EffectEnum.MOON_FORCE]: { wandChoices: 3, luck: 5 },
  [EffectEnum.CHILLY]: { specialDefense: 4 },
  [EffectEnum.FROSTY]: { specialDefense: 12 },
  [EffectEnum.FREEZING]: { specialDefense: 25 },
  [EffectEnum.SHEER_COLD]: { specialDefense: 50, frozenDamageBonusPercent: 30 },
  [EffectEnum.ANCIENT_POWER]: { shieldPercent: 40, attackPercent: 40 },
  [EffectEnum.ELDER_POWER]: { shieldPercent: 70, attackPercent: 70 },
  [EffectEnum.FORGOTTEN_POWER]: { shieldPercent: 100, attackPercent: 100 },
  [EffectEnum.LARGO]: { attackPerCry: 2 },
  [EffectEnum.ALLEGRO]: { attackPerCry: 1, speedPerCry: 5 },
  [EffectEnum.PRESTO]: {
    attackPerCry: 1,
    speedPerCry: 5,
    ppPerCry: 3
  },
  [EffectEnum.LINK_CABLE]: { itemBonusPercent: 5 },
  [EffectEnum.GOOGLE_SPECS]: { itemBonusPercent: 10 },
  [EffectEnum.HATCHER]: {
    eggChance: {
      valuePerTier: [10],
      luckScaling: true
    }
  },
  [EffectEnum.BREEDER]: { hatchStagesEarlier: 1 },
  [EffectEnum.GOLDEN_EGGS]: {
    goldenEggChance: {
      valuePerTier: [5],
      luckScaling: true
    },
    maxGoldenEggs: 1,
    sellGold: SellPrices.SHINY_EGG
  },
  [EffectEnum.APPETIZER]: { chefHats: 1, dishesCooked: 1 },
  [EffectEnum.LUNCH_BREAK]: { dishesCooked: 2 },
  [EffectEnum.BANQUET]: { chefHats: 2 },
  [EffectEnum.SHINING_RAY]: {
    abilityPower: 20,
    baseAttackBonusPercent: 20
  },
  [EffectEnum.LIGHT_PULSE]: { ppPerSecond: 8 },
  [EffectEnum.ETERNAL_LIGHT]: {
    defenseBonusPercent: 50,
    safeguardDuration: 8
  },
  [EffectEnum.MAX_ILLUMINATION]: { shield: 100 },
  [EffectEnum.QUICK_FEET]: {
    speed: 20,
    shopBaseChancePercent: 6,
    shopChancePerStarPercent: 0.5
  },
  [EffectEnum.RUN_AWAY]: { speed: 40 },
  [EffectEnum.HUSTLE]: { speed: 40, baseAttackBonusPercent: 40 },
  [EffectEnum.BERSERK]: {
    hpThresholdPercent: 30,
    shield: 30,
    duration: 3
  },
  [EffectEnum.FLUID]: { speedPerSynergy: 1, hpPerSynergy: 3 },
  [EffectEnum.SHAPELESS]: { speedPerSynergy: 3, hpPerSynergy: 6 },
  [EffectEnum.ETHEREAL]: { speedPerSynergy: 5, hpPerSynergy: 10 },
  [EffectEnum.GRASSY_TERRAIN]: {
    damageBonusPercent: StatusConfigs[Status.GRASS_FIELD].damageBonusPercent
  },
  [EffectEnum.PSYCHIC_TERRAIN]: {
    damageBonusPercent: StatusConfigs[Status.PSYCHIC_FIELD].damageBonusPercent
  },
  [EffectEnum.ELECTRIC_TERRAIN]: {
    damageBonusPercent: StatusConfigs[Status.ELECTRIC_FIELD].damageBonusPercent
  },
  [EffectEnum.MISTY_TERRAIN]: {
    damageBonusPercent: StatusConfigs[Status.FAIRY_FIELD].damageBonusPercent
  },
  [EffectEnum.EMBER]: { damagePerSecond: 10 },
  [EffectEnum.HAIL]: { damage: 10, freezeDuration: 1 },
  [EffectEnum.SPIKES]: { damagePerSecond: 10, armorBreakDuration: 1 },
  [EffectEnum.STEALTH_ROCKS]: { damagePerSecond: 10, woundDuration: 1 },
  [EffectEnum.TOXIC_SPIKES]: { poisonDuration: 1 },
  [EffectEnum.LIGHTNING_STRIKE]: {
    damage: WeatherConfigs[Weather.STORM].lightningDamage
  },
  [EffectEnum.SANDSTORM]: {
    damagePerSecond: WeatherConfigs[Weather.SANDSTORM].damagePerSecond
  },
  [EffectEnum.STICKY_WEB]: { paralysisDuration: 2 },
  [EffectEnum.COTTON_BALL]: { sleepDuration: 1 },
  [EffectEnum.STRANGE_STEAM]: { damageModifierPercent: 20 }
} as const satisfies Partial<Record<EffectEnum, BalanceConfig>>

export function getEffectConfig(effect: EffectEnum): BalanceConfig | undefined {
  return (EffectConfigs as Partial<Record<EffectEnum, BalanceConfig>>)[effect]
}
