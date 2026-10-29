import type { EffectConfig } from "../../types/EffectConfig"
import { EffectEnum } from "../../types/enum/Effect"
import { Rarity, Stat } from "../../types/enum/Game"
import { Item, type ItemsSoldAtTown, SynergyGems } from "../../types/enum/Item"
import { EffectConfigs } from "./effects"
import {
  AQUA_MONICA_CHANCE,
  FIERY_DRUM_CHANCE,
  GRASS_CORNET_CHANCE,
  HONEY_CHANCE,
  ICY_FLUTE_CHANCE,
  INCENSE_CHANCE,
  INTEREST_GOLD_INTERVAL,
  REPEAT_BALL_LEGENDARY_CAP,
  REPEAT_BALL_UNIQUE_CAP,
  REPEAT_BALL_UNIQUE_INTERVAL,
  ROCK_HORN_CHANCE,
  SKY_MELODICA_CHANCE,
  TERRA_CYMBAL_CHANCE
} from "./shop"
import { StatusConfigs } from "./statuses"
import {
  OUTLAW_GOLD_REWARD,
  TREASURE_BOX_LIFE_THRESHOLD
} from "./town-encounters"

const itemStats = {
  [Item.TWISTED_SPOON]: { [Stat.AP]: 10 },
  [Item.MAGNET]: { [Stat.SPEED]: 10 },
  [Item.BLACK_GLASSES]: { [Stat.CRIT_CHANCE]: 10 },
  [Item.MIRACLE_SEED]: { [Stat.HP]: 15 },
  [Item.CHARCOAL]: { [Stat.ATK]: 3 },
  [Item.NEVER_MELT_ICE]: { [Stat.SPE_DEF]: 3 },
  [Item.HEART_SCALE]: { [Stat.DEF]: 3 },
  [Item.MYSTIC_WATER]: { [Stat.PP]: 15 },
  [Item.OLD_AMBER]: {},
  [Item.DAWN_STONE]: { [Stat.AP]: 20 },
  [Item.WATER_STONE]: { [Stat.PP]: 30 },
  [Item.THUNDER_STONE]: { [Stat.SPEED]: 20 },
  [Item.FIRE_STONE]: { [Stat.ATK]: 6 },
  [Item.MOON_STONE]: { [Stat.DEF]: 6 },
  [Item.DUSK_STONE]: { [Stat.CRIT_CHANCE]: 20 },
  [Item.LEAF_STONE]: { [Stat.HP]: 30 },
  [Item.ICE_STONE]: { [Stat.SPE_DEF]: 6 },
  [Item.CHOICE_SPECS]: { [Stat.AP]: 100 },
  [Item.SOUL_DEW]: {},
  [Item.UPGRADE]: { [Stat.AP]: 10, [Stat.SPEED]: 10 },
  [Item.REAPER_CLOTH]: { [Stat.AP]: 10, [Stat.CRIT_CHANCE]: 20 },
  [Item.POKEMONOMICON]: { [Stat.AP]: 30, [Stat.ATK]: 3 },
  [Item.POWER_LENS]: { [Stat.SPE_DEF]: 10, [Stat.AP]: 10 },
  [Item.SHELL_BELL]: { [Stat.ATK]: 5, [Stat.SPE_DEF]: 5 },
  [Item.HEAVY_DUTY_BOOTS]: { [Stat.AP]: 50, [Stat.DEF]: 12 },
  [Item.AQUA_EGG]: { [Stat.PP]: 30 },
  [Item.BLUE_ORB]: { [Stat.PP]: 15, [Stat.SPEED]: 10 },
  [Item.SCOPE_LENS]: { [Stat.PP]: 15, [Stat.CRIT_CHANCE]: 25 },
  [Item.STAR_DUST]: { [Stat.SPE_DEF]: 10, [Stat.PP]: 15 },
  [Item.GREEN_ORB]: { [Stat.HP]: 15 },
  [Item.DEEP_SEA_TOOTH]: { [Stat.ATK]: 7, [Stat.PP]: 15 },
  [Item.SMOKE_BALL]: { [Stat.CRIT_CHANCE]: 10 },
  [Item.XRAY_VISION]: { [Stat.SPEED]: 50 },
  [Item.RAZOR_FANG]: {
    [Stat.SPEED]: 10,
    [Stat.CRIT_CHANCE]: 10,
    [Stat.CRIT_POWER]: 50
  },
  [Item.LOADED_DICE]: { [Stat.SPEED]: 10, [Stat.SPE_DEF]: 3, [Stat.LUCK]: 20 },
  [Item.PUNCHING_GLOVE]: { [Stat.SPEED]: 10, [Stat.ATK]: 3 },
  [Item.MUSCLE_BAND]: { [Stat.SPEED]: 10, [Stat.DEF]: 3 },
  [Item.STICKY_BARB]: { [Stat.DEF]: 6, [Stat.HP]: 15 },
  [Item.ABILITY_SHIELD]: { [Stat.AP]: 10 },
  [Item.WIDE_LENS]: {
    [Stat.RANGE]: 2,
    [Stat.CRIT_CHANCE]: 15,
    [Stat.SPE_DEF]: 3
  },
  [Item.RAZOR_CLAW]: { [Stat.CRIT_CHANCE]: 50, [Stat.ATK]: 3 },
  [Item.SAFETY_GOGGLES]: { [Stat.CRIT_CHANCE]: 10, [Stat.DEF]: 3 },
  [Item.KINGS_ROCK]: { [Stat.HP]: 100 },
  [Item.SHINY_CHARM]: { [Stat.DEF]: 3 },
  [Item.PROTECTIVE_PADS]: { [Stat.SHIELD]: 60, [Stat.ATK]: 6 },
  [Item.ASSAULT_VEST]: { [Stat.SPE_DEF]: 40 },
  [Item.AMULET_COIN]: {},
  [Item.POKE_DOLL]: { [Stat.DEF]: 3, [Stat.SPE_DEF]: 3 },
  [Item.RED_ORB]: { [Stat.ATK]: 10 },
  [Item.FLAME_ORB]: { [Stat.ATK]: 5, [Stat.DEF]: 3 },
  [Item.ROCKY_HELMET]: { [Stat.DEF]: 25 },
  [Item.MAGMARIZER]: { [Stat.ATK]: 5 },
  [Item.MACHO_BRACE]: { [Stat.ATK]: 15, [Stat.SPEED]: -15 },
  [Item.LIGHT_BALL]: { [Stat.AP]: 50 },
  [Item.DRAGON_SCALE]: { [Stat.DEF]: 5, [Stat.SPE_DEF]: 5 },
  [Item.METRONOME]: { [Stat.PP]: 5 },
  [Item.METAL_COAT]: { [Stat.DEF]: 10, [Stat.SPE_DEF]: 10 },
  [Item.AIR_BALLOON]: { [Stat.SPEED]: 30 },
  [Item.EXPLORER_KIT]: { [Stat.DEF]: 5, [Stat.SPE_DEF]: 5, [Stat.ATK]: 3 },
  [Item.PROTECTOR]: { [Stat.SHIELD]: 75 },
  [Item.BERSERK_GENE]: { [Stat.ATK]: 10 },
  [Item.ELECTIRIZER]: { [Stat.SPEED]: 10 },
  [Item.TERRAIN_EXTENDER]: { [Stat.SHIELD]: 50, [Stat.PP]: 20 },
  [Item.INCENSE]: { [Stat.SPE_DEF]: 10, [Stat.LUCK]: 30 },
  [Item.COOKING_POT]: { [Stat.DEF]: 10 },
  [Item.RUNNING_SHOES]: { [Stat.SPEED]: 15 },
  [Item.EVIOLITE]: {
    [Stat.HP]: 100,
    [Stat.ATK]: 10,
    [Stat.AP]: 50,
    [Stat.DEF]: 10,
    [Stat.SPE_DEF]: 10
  },
  [Item.GOLD_BOTTLE_CAP]: {
    [Stat.LUCK]: 50,
    [Stat.CRIT_CHANCE]: 30
  },
  [Item.STAR_PIECE]: {},
  [Item.SHINY_STONE]: { [Stat.AP]: 50 },
  [Item.ABSORB_BULB]: { [Stat.DEF]: 20, [Stat.SPE_DEF]: 20 },
  [Item.GOLD_BOW]: { [Stat.SHIELD]: 50 },
  [Item.TEAL_MASK]: { [Stat.SHIELD]: 100, [Stat.SPEED]: 30 },
  [Item.WELLSPRING_MASK]: { [Stat.SHIELD]: 100, [Stat.SPE_DEF]: 10 },
  [Item.CORNERSTONE_MASK]: { [Stat.SHIELD]: 100, [Stat.DEF]: 10 },
  [Item.HEARTHFLAME_MASK]: { [Stat.SHIELD]: 100, [Stat.ATK]: 10 },
  [Item.SILK_SCARF]: { [Stat.SHIELD]: 15 },
  [Item.FRIEND_BOW]: { [Stat.SHIELD]: 30 },
  [Item.BLACK_BELT]: { [Stat.SHIELD]: 15, [Stat.CRIT_CHANCE]: 30 },
  [Item.NULLIFY_BANDANNA]: { [Stat.SHIELD]: 30 },
  [Item.LUCKY_RIBBON]: { [Stat.SHIELD]: 15, [Stat.AP]: 50, [Stat.LUCK]: 20 },
  [Item.EXPLOSIVE_BAND]: { [Stat.SHIELD]: 50, [Stat.ATK]: 3 },
  [Item.TWIST_BAND]: { [Stat.SPE_DEF]: 20, [Stat.SHIELD]: 50 },
  [Item.BIG_EATER_BELT]: { [Stat.HP]: 50, [Stat.SHIELD]: 15 },
  [Item.MACH_RIBBON]: { [Stat.SHIELD]: 15, [Stat.SPEED]: 10 },
  [Item.COVER_BAND]: { [Stat.DEF]: 12, [Stat.SHIELD]: 50 },
  [Item.EFFICIENT_BANDANNA]: { [Stat.SHIELD]: 15, [Stat.PP]: 15 },
  [Item.TATSUGIRI_CURLY]: { [Stat.HP]: 50, [Stat.ATK]: 8 },
  [Item.TATSUGIRI_DROOPY]: { [Stat.HP]: 50, [Stat.DEF]: 8 },
  [Item.TATSUGIRI_STRETCHY]: { [Stat.HP]: 50, [Stat.SPEED]: 25 }
} satisfies Partial<Record<Item, Partial<Record<Stat, number>>>>

export const ItemStats: typeof itemStats &
  Partial<Record<Item, Partial<Record<Stat, number>>>> = itemStats

export const ItemSellPricesAtTown = {
  [Item.TINY_MUSHROOM]: 1,
  [Item.BIG_MUSHROOM]: 2,
  [Item.BALM_MUSHROOM]: 5
} satisfies Partial<Record<ItemsSoldAtTown, number>>

export const TM_MAX_PP = 100
export const DOJO_TRAINING_DURATION_STAGES = 3
export const WEATHER_ROCK_SCORE = 3
export const MISSION_ORDER_REWARD_GOLD = 30
export const SYNERGY_GEM_BONUS = 1

export const GoldMaskSpawns = [
  {
    maxStage: 5,
    spawns: [
      [Rarity.COMMON, 1],
      [Rarity.COMMON, 1],
      [Rarity.COMMON, 1]
    ]
  },
  {
    maxStage: 10,
    spawns: [
      [Rarity.COMMON, 1],
      [Rarity.COMMON, 1],
      [Rarity.UNCOMMON, 1]
    ]
  },
  {
    maxStage: 15,
    spawns: [
      [Rarity.UNCOMMON, 1],
      [Rarity.UNCOMMON, 1],
      [Rarity.RARE, 1]
    ]
  },
  {
    maxStage: 20,
    spawns: [
      [Rarity.UNCOMMON, 1],
      [Rarity.RARE, 1],
      [Rarity.EPIC, 1]
    ]
  },
  {
    maxStage: 25,
    spawns: [
      [Rarity.UNCOMMON, 2],
      [Rarity.RARE, 1],
      [Rarity.EPIC, 1]
    ]
  },
  {
    maxStage: 30,
    spawns: [
      [Rarity.RARE, 2],
      [Rarity.EPIC, 1],
      [Rarity.EPIC, 1]
    ]
  },
  {
    maxStage: 35,
    spawns: [
      [Rarity.RARE, 2],
      [Rarity.EPIC, 2],
      [Rarity.UNIQUE, 3]
    ]
  },
  {
    maxStage: Infinity,
    spawns: [
      [Rarity.EPIC, 2],
      [Rarity.UNIQUE, 3],
      [Rarity.ULTRA, 2]
    ]
  }
] satisfies { maxStage: number; spawns: [Rarity, number][] }[]

const berry = { hpThresholdPercent: 50, heal: 50 }
const goldenBerry = {
  hpThresholdPercent: berry.hpThresholdPercent,
  healPercent: 50,
  minimumHeal: 50
}
const weatherRock = { weatherScore: WEATHER_ROCK_SCORE }
const wand = { attackDamagePercent: 20 }
const blastWandBonusPercent = 30
const twoEdgedWandBonusPercent = 30
const amuletCoinInterestReduction = 1
const gimmighoulInterestBonus = 1

export const ItemConfigs = {
  [Item.CELL_BATTERY]: {
    ...EffectConfigs[EffectEnum.SUPERCHARGE],
    benchSpeedBonus: 2,
    chargeRequired: 100
  },
  [Item.POKERUS_VIAL]: StatusConfigs.POKERUS,
  [Item.BLUE_ORB]: {
    attackInterval: 3,
    targetCount: 2,
    damage: 10,
    ppBurn: 15
  },
  [Item.LOADED_DICE]: {
    triggerChance: { value: 50, luckScaling: true },
    damagePercent: 75,
    additionalTargets: 1
  },
  [Item.RAZOR_FANG]: { armorBreakDurationSeconds: 2 },
  [Item.POKEMONOMICON]: { burnDurationSeconds: 3, specialDefenseReduction: 1 },
  [Item.SOUL_DEW]: { abilityPower: 5, pp: 5, intervalSeconds: 1 },
  [Item.MACH_RIBBON]: {
    speedPerTick: 20,
    removalSpeedPerTick: 15,
    intervalSeconds: 3
  },
  [Item.GREEN_ORB]: {
    healingPercent: 5,
    overhealToPpPercent: 30,
    intervalSeconds: 2
  },
  [Item.RUNNING_SHOES]: { speedPerMove: 5 },
  [Item.SMOKE_BALL]: {
    activationThresholdPercent: 40,
    shield: 70,
    statusDurationSeconds: 4
  },
  [Item.RUSTED_SWORD]: { baseAttackBonusPercent: 50 },
  [Item.SHELL_BELL]: { healingPercent: 33 },
  [Item.BLACK_BELT]: { shieldPercent: 33 },
  [Item.AIR_BALLOON]: { dodgeChancePercent: { value: 10, luckScaling: true } },
  [Item.FLAME_ORB]: {
    baseAttackBonusPercent: 100,
    burnDurationSeconds: 300,
    burnRefreshDurationSeconds: 60
  },
  [Item.SAFETY_GOGGLES]: { safeguardDurationSeconds: 60 },
  [Item.KINGS_ROCK]: { maxHp: ItemStats.KINGS_ROCK.HP, shieldPercent: 20 },
  [Item.DYNAMAX_BAND]: { baseHpBonusPercent: 200 },
  [Item.GOLD_BOTTLE_CAP]: { critPowerPerGoldPercent: 1, goldPerKo: 1 },
  [Item.REPEAT_BALL]: {
    rerollsPerStack: 2,
    shieldPerStack: 2,
    speedPerStack: 1,
    freeRerolls: 1,
    legendaryRerollCap: REPEAT_BALL_LEGENDARY_CAP,
    uniqueRerollCap: REPEAT_BALL_UNIQUE_CAP,
    uniqueInterval: REPEAT_BALL_UNIQUE_INTERVAL
  },
  [Item.UPGRADE]: { speedPerAttack: 5 },
  [Item.MUSCLE_BAND]: {
    maxStacks: 20,
    stacksPerBuff: 2,
    defense: 2,
    attack: 1,
    speed: 5
  },
  [Item.DEEP_SEA_TOOTH]: { ppPerAttack: 5, ppPerKo: 15 },
  [Item.AMULET_COIN]: {
    goldPerKo: 1,
    maxInterestReduction: amuletCoinInterestReduction,
    eligibleGoldReduction: amuletCoinInterestReduction * INTEREST_GOLD_INTERVAL
  },
  [Item.ELECTIRIZER]: { attackInterval: 3, durationSeconds: 2 },
  [Item.REAPER_CLOTH]: { critPowerBonusPercent: 50 },
  [Item.STICKY_BARB]: {
    damage: 3,
    defenseScalingPercent: 15,
    woundDurationSeconds: 3
  },
  [Item.AQUA_EGG]: { ppRestorePercent: 20, ppPerCast: 2, minPpMissing: 10 },
  [Item.SCOPE_LENS]: { ppSteal: 10 },
  [Item.STAR_DUST]: { shieldPerMaxPpPercent: 50 },
  [Item.MAX_ELIXIR]: { restoreMaxPpPercent: 100, delaySeconds: 1 },
  [Item.ABSORB_BULB]: { activationThresholdPercent: 50 },
  [Item.FIRE_SHARD]: {
    playerHpCost: 3,
    doubleUpHpCost: 1,
    attack: 3,
    speed: 3
  },
  [Item.AMAZE_MULCH]: { maxHp: 50, abilityPower: 30, richMulchRequired: 8 },
  [Item.MUSHROOMS]: {
    tinyMushroomWeight: 77,
    bigMushroomWeight: 20,
    balmMushroomWeight: 3
  },
  [Item.COMFEY]: { spawnRadius: 2 },
  [Item.STAR_PIECE]: { starsGranted: 1, maxStars: 5 },
  [Item.SPELL_TAG]: { curseDelaySeconds: 10 },
  [Item.EXPLOSIVE_BAND]: { shieldDamagePercent: 50 },
  [Item.EFFICIENT_BANDANNA]: { maxPpReductionPercent: 15 },
  [Item.LUCKY_RIBBON]: {
    luck: ItemStats.LUCKY_RIBBON.LUCK,
    dodgeChance: { value: 15, luckScaling: true }
  },
  [Item.BALL]: {
    shield: 50,
    speedDamagePercent: 30,
    projectileSpeed: 4,
    allyTransferDelayMs: 500
  },
  [Item.BERRY_JUICE]: { shield: 100 },
  [Item.BIG_MUSHROOM]: {
    maxHpBonusPercent: 30,
    sellPrice: ItemSellPricesAtTown.BIG_MUSHROOM
  },
  [Item.BALM_MUSHROOM]: {
    safeguardDurationSeconds: 30,
    speed: 30,
    healPercent: 10,
    intervalSeconds: 1,
    sellPrice: ItemSellPricesAtTown.BALM_MUSHROOM
  },
  [Item.BINDING_MOCHI]: { durationSeconds: 5 },
  [Item.BLACK_SLUDGE]: {
    healPercent: 5,
    intervalSeconds: 2,
    selfPoisonDurationSeconds: 30,
    effectChance: { value: 30, luckScaling: true },
    durationSeconds: 5
  },
  [Item.CASTELIACONE]: {
    effectChance: { value: 30, luckScaling: true },
    durationSeconds: 2
  },
  [Item.CURRY]: { durationSeconds: 3 },
  [Item.FRUIT_JUICE]: { speed: 50 },
  [Item.LUCKY_EGG]: { luck: 30, abilityPower: 30 },
  [Item.HEARTY_STEW]: { maxHpBonusPercent: 30, burnDurationSeconds: 5 },
  [Item.LARGE_LEEK]: { critPower: 100, abilityCritPower: 50 },
  [Item.LEEK]: { critChance: 50, abilityCritPower: 50 },
  [Item.MOOMOO_MILK]: { maxHp: 15 },
  [Item.NUTRITIOUS_EGG]: { baseStatBonusPercent: 50 },
  [Item.OLIVE_OIL]: { dodgeChancePercent: { value: 20, luckScaling: true } },
  [Item.POFFIN]: { shield: 100 },
  [Item.RAGE_CANDY_BAR]: { attack: 10 },
  [Item.ROCK_SALT]: { safeguardDurationSeconds: 10, shieldPercent: 20 },
  [Item.SANDWICH]: {
    maxHp: 20,
    shield: 30,
    attack: 5,
    dodgeChancePercent: 5,
    speed: 10,
    specialDefense: 5,
    defense: 5,
    abilityPower: 20,
    critChance: 5,
    critPower: 10,
    pp: 20
  },
  [Item.SMOKED_FILET]: { maxHpCost: 5, attack: 3, abilityPower: 10 },
  [Item.SPINDA_COCKTAIL]: {
    positiveChance: { value: 80, luckScaling: true },
    attack: 10,
    speed: 50,
    abilityPower: 50,
    shield: 100,
    durationSeconds: 5
  },
  [Item.SIRUPY_APPLE]: {
    effectChance: { value: 30, luckScaling: true },
    durationSeconds: 1
  },
  [Item.SWEET_APPLE]: { specialDefenseReduction: 2 },
  [Item.TART_APPLE]: { defenseReduction: 2 },
  [Item.TEA]: { pp: 60 },
  [Item.TINY_MUSHROOM]: {
    maxHpReductionPercent: 30,
    speed: 30,
    sellPrice: ItemSellPricesAtTown.TINY_MUSHROOM
  },
  [Item.WHIPPED_DREAM]: {
    effectChance: { value: 30, luckScaling: true },
    durationSeconds: 2
  },
  [Item.STRAWBERRY_SWEET]: { attack: 3 },
  [Item.LOVE_SWEET]: { defense: 3 },
  [Item.BERRY_SWEET]: { maxHp: 15 },
  [Item.CLOVER_SWEET]: { luck: 10 },
  [Item.FLOWER_SWEET]: { speed: 10 },
  [Item.STAR_SWEET]: { abilityPower: 10 },
  [Item.RIBBON_SWEET]: { specialDefense: 3 },
  [Item.RICE]: { maxHp: 50 },
  [Item.AGUAV_BERRY]: {
    hpThresholdPercent: berry.hpThresholdPercent,
    minimumHeal: 50,
    healPercent: 50,
    durationSeconds: 3
  },
  [Item.APICOT_BERRY]: { ...berry, specialDefense: 20 },
  [Item.ASPEAR_BERRY]: { ...berry, speed: 15 },
  [Item.BABIRI_BERRY]: { ...berry, durationSeconds: 2 },
  [Item.CHERI_BERRY]: { ...berry, attack: 10 },
  [Item.CHESTO_BERRY]: { ...berry, abilityPower: 50 },
  [Item.GANLON_BERRY]: { ...berry, defense: 20 },
  [Item.JABOCA_BERRY]: { ...berry, durationSeconds: 10 },
  [Item.LANSAT_BERRY]: { ...berry, critChance: 50 },
  [Item.LEPPA_BERRY]: { ...berry, pp: 50 },
  [Item.LIECHI_BERRY]: { ...berry, attack: 15 },
  [Item.LUM_BERRY]: { ...berry, durationSeconds: 5 },
  [Item.ORAN_BERRY]: { ...berry, shield: 80 },
  [Item.PECHA_BERRY]: { ...berry, heal: 100 },
  [Item.PERSIM_BERRY]: { ...berry, specialDefense: 10 },
  [Item.PETAYA_BERRY]: { ...berry, abilityPower: 80 },
  [Item.RAWST_BERRY]: { ...berry, defense: 10 },
  [Item.ROWAP_BERRY]: { ...berry, durationSeconds: 10 },
  [Item.SALAC_BERRY]: { ...berry, speed: 50 },
  [Item.SITRUS_BERRY]: { ...berry, heal: 100, healBonusPercent: 30 },
  [Item.NANAB_BERRY]: { ...berry, gold: 1 },
  [Item.GOLDEN_NANAB_BERRY]: { ...goldenBerry, gold: 5 },
  [Item.GOLDEN_RAZZ_BERRY]: { ...goldenBerry, freeRerolls: 6 },
  [Item.GOLDEN_PINAP_BERRY]: { ...goldenBerry, sweets: 3 },
  [Item.TWISTED_SPOON]: { abilityPower: ItemStats.TWISTED_SPOON.AP },
  [Item.MYSTIC_WATER]: { pp: ItemStats.MYSTIC_WATER.PP },
  [Item.MAGNET]: { speed: ItemStats.MAGNET.SPEED },
  [Item.BLACK_GLASSES]: { critChance: ItemStats.BLACK_GLASSES.CRIT_CHANCE },
  [Item.MIRACLE_SEED]: { maxHp: ItemStats.MIRACLE_SEED.HP },
  [Item.NEVER_MELT_ICE]: { specialDefense: ItemStats.NEVER_MELT_ICE.SPE_DEF },
  [Item.CHARCOAL]: { attack: ItemStats.CHARCOAL.ATK },
  [Item.HEART_SCALE]: { defense: ItemStats.HEART_SCALE.DEF },
  [Item.CHOICE_SPECS]: { abilityPower: ItemStats.CHOICE_SPECS.AP },
  [Item.WIDE_LENS]: { range: ItemStats.WIDE_LENS.RANGE },
  [Item.RAZOR_CLAW]: { critChance: ItemStats.RAZOR_CLAW.CRIT_CHANCE },
  [Item.ASSAULT_VEST]: {
    specialDefense: ItemStats.ASSAULT_VEST.SPE_DEF,
    damageReductionPercent: 50
  },
  [Item.POKE_DOLL]: { damageReductionPercent: 30 },
  [Item.RED_ORB]: { trueDamagePercent: 25 },
  [Item.ROCKY_HELMET]: { defense: ItemStats.ROCKY_HELMET.DEF },
  [Item.SHINY_CHARM]: {
    hpThresholdPercent: 30,
    pp: 50,
    protectDurationSeconds: 1.5
  },
  [Item.PROTECTIVE_PADS]: { shieldDamageMultiplier: 2 },
  [Item.PUNCHING_GLOVE]: { targetHpDamagePercent: 8 },
  [Item.WONDER_BOX]: { itemCount: 2 },
  [Item.ABILITY_SHIELD]: { shieldPercent: 20, safeguardDurationSeconds: 5 },
  [Item.GRACIDEA_FLOWER]: { speed: 20 },
  [Item.MAGMARIZER]: { burnSpeed: 30 },
  [Item.METRONOME]: { ppPerSecond: 5 },
  [Item.SHED_SHELL]: { cloneMaxHpReductionPercent: 50 },
  [Item.BERSERK_GENE]: { confusionDurationSeconds: 1 },
  [Item.COOKING_POT]: {
    speedPerBurnTick: 10,
    intervalSeconds: StatusConfigs.BURN.intervalSeconds
  },
  [Item.GOLD_MASK]: { spawnCount: GoldMaskSpawns[0].spawns.length },
  [Item.SACRED_ASH]: { allyCount: 3 },
  [Item.RED_SCALE]: { income: 5 },
  [Item.DAMP_ROCK]: { ...weatherRock, ppPerSecond: 2 },
  [Item.ICY_ROCK]: {
    ...weatherRock,
    freezeReductionPercent: 20,
    freezeChance: { value: 5, luckScaling: true }
  },
  [Item.SUN_STONE]: {
    ...weatherRock,
    heal: 5,
    intervalSeconds: 2,
    burnChancePercent: { value: 5, luckScaling: true },
    burnDurationSeconds: 3
  },
  [Item.HEAT_ROCK]: {
    ...weatherRock,
    attack: 3,
    burnDamageReductionPercent: 20
  },
  [Item.SMOOTH_ROCK]: {
    ...weatherRock,
    damageReductionPercent: 20,
    speedPerSecond: 1
  },
  [Item.BLACK_AUGURITE]: {
    ...weatherRock,
    critChance: 5,
    critDamageReductionPercent: 10
  },
  [Item.ELECTRIC_QUARTZ]: {
    ...weatherRock,
    shield: 50,
    paralysisReductionPercent: 20
  },
  [Item.FLOAT_STONE]: { ...weatherRock, speed: 10 },
  [Item.MIST_STONE]: { ...weatherRock, specialDefense: 3 },
  [Item.BLOOD_STONE]: {
    ...weatherRock,
    woundHealToShieldPercent: 30,
    woundLifestealPercent: 20
  },
  [Item.SMELLY_CLAY]: {
    ...weatherRock,
    accuracyBonusPercent: 5,
    poisonChanceReductionPercent: 15
  },
  [Item.ODD_KEYSTONE]: {
    ...weatherRock,
    luck: 10,
    statusReductionPercent: 10,
    curseDelaySeconds: 1
  },
  [Item.CONFUSE_WAND]: {
    ...wand,
    effectChance: { value: 5, luckScaling: true },
    durationSeconds: 2,
    specialDefenseReduction: 3
  },
  [Item.PETRIFY_WAND]: {
    ...wand,
    effectChance: { value: 5, luckScaling: true },
    durationSeconds: 2,
    defenseReduction: 3
  },
  [Item.SLOW_WAND]: {
    ...wand,
    effectChance: { value: 5, luckScaling: true },
    durationSeconds: 2,
    speedReduction: 10
  },
  [Item.SLUMBER_WAND]: {
    ...wand,
    effectChance: { value: 5, luckScaling: true },
    durationSeconds: 2,
    attackReduction: 3
  },
  [Item.BLAST_WAND]: {
    ...wand,
    critBonusPercent: blastWandBonusPercent,
    critDamagePercent: wand.attackDamagePercent + blastWandBonusPercent
  },
  [Item.HP_SWAP_WAND]: {
    ...wand,
    effectChance: { value: 20, luckScaling: true }
  },
  [Item.SPIRIT_WAND]: {
    ...wand,
    damagePerCastPercent: 5,
    ppChance: { value: 20, luckScaling: true },
    pp: 5
  },
  [Item.LONG_WAND]: {
    ...wand,
    range: 1,
    critChancePerDistance: { value: 1, luckScaling: true }
  },
  [Item.GUIDING_WAND]: {
    ...wand,
    effectChance: { value: 50, luckScaling: true }
  },
  [Item.SURROUND_WAND]: {
    ...wand,
    damagePerEnemyPercent: 5,
    effectChance: { value: 10, luckScaling: true }
  },
  [Item.POUNCE_WAND]: {
    ...wand,
    effectChance: { value: 10, luckScaling: true },
    retaliationPercent: 30,
    cooldownMs: 250,
    minimumDamage: 1
  },
  [Item.TWO_EDGED_WAND]: {
    ...wand,
    bonusDamagePercent: twoEdgedWandBonusPercent,
    totalDamagePercent: wand.attackDamagePercent + twoEdgedWandBonusPercent,
    preventRecoilChance: { value: 80, luckScaling: true }
  },
  [Item.WARP_WAND]: { ...wand, effectChance: { value: 5, luckScaling: true } },
  [Item.SWITCHER_WAND]: {
    ...wand,
    effectChance: { value: 5, luckScaling: true }
  },
  [Item.WHIRLWIND_WAND]: {
    ...wand,
    effectChance: { value: 5, luckScaling: true },
    throwDistance: 2
  },
  [Item.TUNNEL_WAND]: {
    ...wand,
    effectChance: { value: 5, luckScaling: true }
  },
  [Item.INCENSE]: {
    shopChancePercent: { value: INCENSE_CHANCE * 100, luckScaling: true }
  },
  [Item.HONEY]: {
    shopChancePercent: { value: HONEY_CHANCE * 100, luckScaling: true }
  },
  [Item.AQUA_MONICA]: { shopChancePercent: AQUA_MONICA_CHANCE * 100 },
  [Item.FIERY_DRUM]: { shopChancePercent: FIERY_DRUM_CHANCE * 100 },
  [Item.GRASS_CORNET]: { shopChancePercent: GRASS_CORNET_CHANCE * 100 },
  [Item.ICY_FLUTE]: { shopChancePercent: ICY_FLUTE_CHANCE * 100 },
  [Item.ROCK_HORN]: { shopChancePercent: ROCK_HORN_CHANCE * 100 },
  [Item.SKY_MELODICA]: { shopChancePercent: SKY_MELODICA_CHANCE * 100 },
  [Item.TERRA_CYMBAL]: { shopChancePercent: TERRA_CYMBAL_CHANCE * 100 },
  [Item.BRONZE_DOJO_TICKET]: {
    durationStages: DOJO_TRAINING_DURATION_STAGES,
    maxHp: 50,
    attack: 5,
    abilityPower: 15
  },
  [Item.SILVER_DOJO_TICKET]: {
    durationStages: DOJO_TRAINING_DURATION_STAGES,
    maxHp: 100,
    attack: 10,
    abilityPower: 30
  },
  [Item.GOLD_DOJO_TICKET]: {
    durationStages: DOJO_TRAINING_DURATION_STAGES,
    maxHp: 150,
    attack: 15,
    abilityPower: 45
  },
  [Item.MISSION_ORDER_PINK]: {
    rewardGold: MISSION_ORDER_REWARD_GOLD,
    count: 4,
    stars: 3
  },
  [Item.MISSION_ORDER_RED]: {
    rewardGold: MISSION_ORDER_REWARD_GOLD,
    playerDamage: 100
  },
  [Item.MISSION_ORDER_BLUE]: {
    rewardGold: MISSION_ORDER_REWARD_GOLD,
    level: 9
  },
  [Item.MISSION_ORDER_GREEN]: {
    rewardGold: MISSION_ORDER_REWARD_GOLD,
    activeSynergies: 8
  },
  [Item.MISSION_ORDER_GOLD]: {
    rewardGold: MISSION_ORDER_REWARD_GOLD,
    earnedGold: 200
  },
  [Item.LEADERS_CREST]: { rewardGold: 4 },
  [Item.NULLIFY_BANDANNA]: { abilityPowerPerAttack: 5 },
  [Item.BIG_EATER_BELT]: { statBonusPercent: 25, dishesPerRound: 2 },
  [Item.GIMMIGHOUL_COIN]: {
    gold: 5,
    maxInterestBonus: gimmighoulInterestBonus,
    eligibleGoldBonus: gimmighoulInterestBonus * INTEREST_GOLD_INTERVAL
  },
  [Item.TEAL_MASK]: {
    shield: ItemStats.TEAL_MASK.SHIELD,
    speed: ItemStats.TEAL_MASK.SPEED
  },
  [Item.WELLSPRING_MASK]: {
    shield: ItemStats.WELLSPRING_MASK.SHIELD,
    specialDefense: ItemStats.WELLSPRING_MASK.SPE_DEF
  },
  [Item.HEARTHFLAME_MASK]: {
    shield: ItemStats.HEARTHFLAME_MASK.SHIELD,
    attack: ItemStats.HEARTHFLAME_MASK.ATK
  },
  [Item.CORNERSTONE_MASK]: {
    shield: ItemStats.CORNERSTONE_MASK.SHIELD,
    defense: ItemStats.CORNERSTONE_MASK.DEF
  },
  [Item.EXPLORER_KIT]: {
    bigNuggetChance: { value: 10, luckScaling: true },
    nuggetChance: { value: 50, luckScaling: true }
  },
  [Item.COIN]: { gold: 1 },
  [Item.NUGGET]: { gold: 3 },
  [Item.BIG_NUGGET]: { gold: 10 },
  [Item.TREASURE_BOX]: {
    itemCount: 2,
    hpThreshold: TREASURE_BOX_LIFE_THRESHOLD
  },
  [Item.WANTED_NOTICE]: { rewardGold: OUTLAW_GOLD_REWARD },
  [Item.BERRIES_GIFT]: { amount: 7 },
  [Item.SWEETS_GIFT]: { amount: 7 },
  [Item.DITTO_GIFT]: { amount: 1 },
  [Item.HATCH_BUNDLE]: {
    amount: 2,
    goldenEggChancePercent: 5,
    hatchStars: 1,
    maxHp: 50,
    attack: 5,
    abilityPower: 15
  },
  [Item.REGIONAL_TOUR]: { freeRerolls: 10 },
  [Item.STAR_GIFT]: {
    maxHp: 200,
    attack: 10,
    abilityPower: 50,
    defense: 5,
    specialDefense: 5,
    speed: 20
  },
  [Item.GEMS_BUNDLE]: { amount: 3 },
  [Item.POTION]: { heal: 10, maxPlayerHp: 100 },
  [Item.FORAGE_BAG]: { amount: 3 },
  [Item.COLLECTION_BOX]: {
    apples: 1,
    scarves: 1,
    completedItems: 1,
    tools: 1,
    berries: 2
  },
  [Item.PRETTY_BOX]: { amount: 2 },
  [Item.DELUXE_BOX]: { amount: 1 },
  [Item.TOOLBOX]: { amount: 3 },
  [Item.COMMON_GIFT]: { stars: 3, topSynergies: 1 },
  [Item.UNCOMMON_GIFT]: { stars: 2, topSynergies: 1 },
  [Item.RARE_GIFT]: { stars: 2, topSynergies: 1 },
  [Item.EPIC_GIFT]: { stars: 2, topSynergies: 1 },
  [Item.ULTRA_GIFT]: { stars: 1, topSynergies: 2 },
  [Item.UNIQUE_GIFT]: { stars: 3, topSynergies: 1 },
  [Item.LEGENDARY_GIFT]: { stars: 3, topSynergies: 2 },
  [Item.SMALL_EXP_GIFT]: { experience: 8 },
  [Item.LARGE_EXP_GIFT]: { experience: 24 },
  ...Object.fromEntries(
    SynergyGems.map((item) => [item, { synergyBonus: SYNERGY_GEM_BONUS }])
  )
} satisfies Partial<Record<Item, EffectConfig>>
