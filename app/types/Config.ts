import { Synergy } from "./enum/Synergy"
import { Pkm, PkmIndex } from "./enum/Pokemon"
import { Item } from "./enum/Item"
import { Effect } from "./enum/Effect"
import { AttackType, Rarity, Stat } from "./enum/Game"
import { Emotion } from "."

export const RarityHpCost: { [key in Rarity]: number } = Object.freeze({
  [Rarity.COMMON]: 1,
  [Rarity.UNCOMMON]: 1,
  [Rarity.RARE]: 2,
  [Rarity.EPIC]: 2,
  [Rarity.LEGENDARY]: 3,
  [Rarity.MYTHICAL]: 4,
  [Rarity.NEUTRAL]: 2,
  [Rarity.SUMMON]: 1,
  [Rarity.HATCH]: 4
})

export const PkmCost: { [key in Rarity]: number } = Object.freeze({
  [Rarity.COMMON]: 1,
  [Rarity.UNCOMMON]: 2,
  [Rarity.RARE]: 3,
  [Rarity.EPIC]: 4,
  [Rarity.MYTHICAL]: 6,
  [Rarity.LEGENDARY]: 5,
  [Rarity.SUMMON]: 1,
  [Rarity.NEUTRAL]: 5,
  [Rarity.HATCH]: 4
})

export const EmotionCost: { [key in Emotion]: number } = {
  [Emotion.NORMAL]: 50,
  [Emotion.HAPPY]: 100,
  [Emotion.PAIN]: 110,
  [Emotion.ANGRY]: 120,
  [Emotion.WORRIED]: 130,
  [Emotion.SAD]: 140,
  [Emotion.CRYING]: 150,
  [Emotion.SHOUTING]: 160,
  [Emotion.TEARY_EYED]: 170,
  [Emotion.DETERMINED]: 180,
  [Emotion.JOYOUS]: 190,
  [Emotion.INSPIRED]: 200,
  [Emotion.SURPRISED]: 210,
  [Emotion.DIZZY]: 220,
  [Emotion.SPECIAL0]: 230,
  [Emotion.SPECIAL1]: 240,
  [Emotion.SIGH]: 250,
  [Emotion.STUNNED]: 260,
  [Emotion.SPECIAL2]: 270,
  [Emotion.SPECIAL3]: 280
}

export function getEmotionCost(emotion: Emotion, isShiny: boolean): number {
  return isShiny ? EmotionCost[emotion] * 3 : EmotionCost[emotion]
}

export const ExpTable: { [key: number]: number } = Object.freeze({
  1: 0,
  2: 2,
  3: 6,
  4: 10,
  5: 20,
  6: 32,
  7: 50,
  8: 70,
  9: 255
})

export const TypeTrigger: { [key in Synergy]: number[] } = {
  [Synergy.NORMAL]: [3, 5, 7, 9],
  [Synergy.GRASS]: [3, 5, 7],
  [Synergy.FIRE]: [2, 4, 6, 8],
  [Synergy.WATER]: [3, 6, 9],
  [Synergy.ELECTRIC]: [2, 4, 6],
  [Synergy.FIGHTING]: [2, 4, 6],
  [Synergy.PSYCHIC]: [2, 4, 6],
  [Synergy.DARK]: [2, 4, 6],
  [Synergy.METAL]: [2, 4],
  [Synergy.GROUND]: [2, 4, 6],
  [Synergy.POISON]: [3, 6],
  [Synergy.DRAGON]: [3, 5],
  [Synergy.FIELD]: [3, 6, 9],
  [Synergy.MONSTER]: [2, 4, 6],
  [Synergy.HUMAN]: [2, 4, 6],
  [Synergy.AQUATIC]: [2, 4],
  [Synergy.BUG]: [2, 4, 6],
  [Synergy.FLYING]: [2, 4, 6, 8],
  [Synergy.FLORA]: [2, 3, 4, 5],
  [Synergy.MINERAL]: [2, 4, 6],
  [Synergy.GHOST]: [2, 4, 6, 8],
  [Synergy.FAIRY]: [2, 4, 6],
  [Synergy.ICE]: [2, 4],
  [Synergy.FOSSIL]: [2, 4, 6],
  [Synergy.SOUND]: [2, 4, 6],
  [Synergy.ARTIFICIAL]: [2, 4, 6],
  [Synergy.BABY]: [3, 5]
}

export const ExpPlace = [700, 500, 400, 300, 200, 150, 100, 0]

export const RarityColor: { [key in Rarity]: string } = {
  [Rarity.COMMON]: "#9f9f9f",
  [Rarity.NEUTRAL]: "#888d9d",
  [Rarity.UNCOMMON]: "#3bc95e",
  [Rarity.RARE]: "#41bfcc",
  [Rarity.EPIC]: "#ca6cee",
  [Rarity.LEGENDARY]: "#e6cb49",
  [Rarity.MYTHICAL]: "#ffc0cb",
  [Rarity.SUMMON]: "#991f1f",
  [Rarity.HATCH]: "#b9915a"
}

export const RarityProbability: { [key in Rarity]: number } = {
  [Rarity.COMMON]: 0.25,
  [Rarity.NEUTRAL]: 0,
  [Rarity.UNCOMMON]: 0.2,
  [Rarity.RARE]: 0.2,
  [Rarity.EPIC]: 0.15,
  [Rarity.LEGENDARY]: 0.05,
  [Rarity.MYTHICAL]: 0,
  [Rarity.SUMMON]: 0,
  [Rarity.HATCH]: 0
}

export const AttackTypeColor: { [key in AttackType] } = {
  [AttackType.PHYSICAL]: "#FF6E55",
  [AttackType.SPECIAL]: "#7FC9FF",
  [AttackType.TRUE]: "#FFD800"
}

export const Probability: { [key: number]: number[] } = {
  1: [1, 0, 0, 0, 0],
  2: [1, 0, 0, 0, 0],
  3: [0.7, 0.3, 0, 0, 0],
  4: [0.55, 0.3, 0.15, 0, 0],
  5: [0.4, 0.3, 0.25, 0.05, 0],
  6: [0.29, 0.295, 0.31, 0.1, 0.005],
  7: [0.24, 0.28, 0.31, 0.15, 0.02],
  8: [0.2, 0.24, 0.31, 0.2, 0.05],
  9: [0.1, 0.19, 0.31, 0.3, 0.1]
}

export const EvolutionTime = {
  EGG_HATCH: 3,
  EVOLVE_HATCH: 4
}

export const NeutralStage: { turn: number; avatar: string }[] = [
  {
    turn: 1,
    avatar: `${PkmIndex[Pkm.MAGIKARP].replace("-", "/")}/${Emotion.NORMAL}`
  },
  {
    turn: 2,
    avatar: `${PkmIndex[Pkm.RATICATE].replace("-", "/")}/${Emotion.NORMAL}`
  },
  {
    turn: 3,
    avatar: `${PkmIndex[Pkm.FEAROW].replace("-", "/")}/${Emotion.NORMAL}`
  },
  {
    turn: 10,
    avatar: `${PkmIndex[Pkm.GYARADOS].replace("-", "/")}/${Emotion.NORMAL}`
  },
  {
    turn: 15,
    avatar: `${PkmIndex[Pkm.LUGIA].replace("-", "/")}/${Emotion.NORMAL}`
  },
  {
    turn: 20,
    avatar: `${PkmIndex[Pkm.GIRATINA].replace("-", "/")}/${Emotion.NORMAL}`
  },
  {
    turn: 25,
    avatar: `${PkmIndex[Pkm.ZAPDOS].replace("-", "/")}/${Emotion.NORMAL}`
  },
  {
    turn: 30,
    avatar: `${PkmIndex[Pkm.DIALGA].replace("-", "/")}/${Emotion.NORMAL}`
  },
  {
    turn: 35,
    avatar: `${PkmIndex[Pkm.SUICUNE].replace("-", "/")}/${Emotion.NORMAL}`
  },
  {
    turn: 40,
    avatar: `${PkmIndex[Pkm.REGICE].replace("-", "/")}/${Emotion.NORMAL}`
  },
  {
    turn: 45,
    avatar: `${PkmIndex[Pkm.RAYQUAZA].replace("-", "/")}/${Emotion.NORMAL}`
  },
  {
    turn: 50,
    avatar: `${PkmIndex[Pkm.RAYQUAZA].replace("-", "/")}/${Emotion.NORMAL}`
  },
  {
    turn: 55,
    avatar: `${PkmIndex[Pkm.RAYQUAZA].replace("-", "/")}/${Emotion.NORMAL}`
  }
]

type ThresholdDuration = {
  duration: number
  threshold: number
}

export const FlyingProtectThreshold: { [key in Effect]?: ThresholdDuration } = {
  [Effect.TAILWIND]: {
    duration: 1000,
    threshold: 0.2
  },
  [Effect.FEATHER_DANCE]: {
    duration: 2000,
    threshold: 0.4
  },
  [Effect.MAX_AIRSTREAM]: {
    duration: 3000,
    threshold: 0.5
  },
  [Effect.MAX_GUARD]: {
    duration: 4000,
    threshold: 0.5
  }
}

export enum EloRank {
  DIAMOND = "DIAMOND",
  PLATINUM = "PLATINUM",
  GOLD = "GOLD",
  SILVER = "SILVER",
  BRONZE = "BRONZE"
}

export const EloRankThreshold: { [key in EloRank]: number } = {
  [EloRank.BRONZE]: 0,
  [EloRank.SILVER]: 900,
  [EloRank.GOLD]: 1100,
  [EloRank.PLATINUM]: 1250,
  [EloRank.DIAMOND]: 1400
}

export enum Header {
  WALL = "WALL",
  WALL_ALT_1 = "WALL_ALT_1",
  WALL_ALT_2 = "WALL_ALT_2",
  WALL_ALT_3 = "WALL_ALT_3",
  GROUND = "GROUND",
  GROUND_ALT_1 = "GROUND_ALT_1",
  GROUND_ALT_2 = "GROUND_ALT_2",
  GROUND_ALT_3 = "GROUND_ALT_3",
  GROUND_ALT_4 = "GROUND_ALT_4",
  WATER = "WATER",
  ABYSS = "ABYSS",
  ABYSS_ALT_1 = "ABYSS_ALT_1",
  ABYSS_ALT_2 = "ABYSS_ALT_2"
}

export const MaskCoordinate: { [key in Mask]: { x: number; y: number } } =
  Object.freeze({
    X: { x: 1, y: 4 },
    A: { x: 1, y: 8 },
    B: { x: 0, y: 7 },
    C: { x: 1, y: 6 },
    D: { x: 2, y: 7 },
    AB: { x: 0, y: 5 },
    AC: { x: 0, y: 4 },
    AD: { x: 2, y: 5 },
    BC: { x: 0, y: 3 },
    BD: { x: 1, y: 3 },
    CD: { x: 2, y: 3 },
    ABC: { x: 0, y: 10 },
    ABD: { x: 1, y: 11 },
    ACD: { x: 2, y: 10 },
    BCD: { x: 1, y: 9 },
    ABCD: { x: 1, y: 7 },
    A1B: { x: 0, y: 2 },
    B2C: { x: 0, y: 0 },
    C3D: { x: 2, y: 0 },
    AD4: { x: 2, y: 2 },
    A1BC: { x: 0, y: 17 },
    AB2C: { x: 0, y: 18 },
    B2CD: { x: 1, y: 19 },
    BC3D: { x: 0, y: 19 },
    AC3D: { x: 1, y: 18 },
    ACD4: { x: 1, y: 17 },
    A1BD: { x: 1, y: 20 },
    ABD4: { x: 0, y: 20 },
    A1B2C: { x: 0, y: 1 },
    B2C3D: { x: 1, y: 0 },
    AC3D4: { x: 2, y: 1 },
    A1BD4: { x: 1, y: 2 },
    A1BCD: { x: 0, y: 22 },
    AB2CD: { x: 0, y: 21 },
    ABC3D: { x: 1, y: 21 },
    ABCD4: { x: 1, y: 22 },
    A1B2CD: { x: 2, y: 13 },
    AB2C3D: { x: 1, y: 14 },
    ABC3D4: { x: 0, y: 13 },
    A1BCD4: { x: 1, y: 12 },
    A1B2C3D: { x: 1, y: 16 },
    AB2C3D4: { x: 0, y: 16 },
    A1BC3D4: { x: 0, y: 15 },
    A1B2CD4: { x: 1, y: 15 },
    A1BC3D: { x: 0, y: 23 },
    AB2CD4: { x: 1, y: 23 },
    A1B2C3D4: { x: 1, y: 1 }
  })

export enum Mask {
  X = "X",
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  AB = "AB",
  AC = "AC",
  AD = "AD",
  BC = "BC",
  BD = "BD",
  CD = "CD",
  ABC = "ABC",
  ABD = "ABD",
  ACD = "ACD",
  BCD = "BCD",
  ABCD = "ABCD",
  A1B = "A1B",
  B2C = "B2C",
  C3D = "C3D",
  AD4 = "AD4",
  A1BC = "A1BC",
  AB2C = "AB2C",
  B2CD = "B2CD",
  BC3D = "BC3D",
  AC3D = "AC3D",
  ACD4 = "ACD4",
  A1BD = "A1BD",
  ABD4 = "ABD4",
  A1B2C = "A1B2C",
  B2C3D = "B2C3D",
  AC3D4 = "AC3D4",
  A1BD4 = "A1BD4",
  A1BCD = "A1BCD",
  AB2CD = "AB2CD",
  ABC3D = "ABC3D",
  ABCD4 = "ABCD4",
  A1B2CD = "A1B2CD",
  AB2C3D = "AB2C3D",
  ABC3D4 = "ABC3D4",
  A1BCD4 = "A1BCD4",
  A1B2C3D = "A1B2C3D",
  AB2C3D4 = "AB2C3D4",
  A1BC3D4 = "A1BC3D4",
  A1B2CD4 = "A1B2CD4",
  A1BC3D = "A1BC3D",
  AB2CD4 = "AB2CD4",
  A1B2C3D4 = "A1B2C3D4"
}

export enum TerrainType {
  GROUND,
  WALL,
  WATER
}

export const IdTable: { [key: number]: Mask } = {
  0: Mask.X,
  1: Mask.A,
  2: Mask.B,
  4: Mask.C,
  8: Mask.D,
  3: Mask.AB,
  5: Mask.AC,
  9: Mask.AD,
  6: Mask.BC,
  10: Mask.BD,
  12: Mask.CD,
  7: Mask.ABC,
  11: Mask.ABD,
  13: Mask.ACD,
  14: Mask.BCD,
  15: Mask.ABCD,
  19: Mask.A1B,
  38: Mask.B2C,
  76: Mask.C3D,
  137: Mask.AD4,
  23: Mask.A1BC,
  39: Mask.AB2C,
  46: Mask.B2CD,
  78: Mask.BC3D,
  77: Mask.AC3D,
  141: Mask.ACD4,
  27: Mask.A1BD,
  139: Mask.ABD4,
  55: Mask.A1B2C,
  110: Mask.B2C3D,
  205: Mask.AC3D4,
  155: Mask.A1BD4,
  31: Mask.A1BCD,
  47: Mask.AB2CD,
  79: Mask.ABC3D,
  143: Mask.ABCD4,
  63: Mask.A1B2CD,
  111: Mask.AB2C3D,
  207: Mask.ABC3D4,
  159: Mask.A1BCD4,
  127: Mask.A1B2C3D,
  239: Mask.AB2C3D4,
  223: Mask.A1BC3D4,
  191: Mask.A1B2CD4,
  95: Mask.A1BC3D,
  175: Mask.AB2CD4,
  255: Mask.A1B2C3D4
}

export const ItemRecipe: { [key in Item]?: Item[] } = {
  [Item.OLD_AMBER]: [Item.FOSSIL_STONE, Item.FOSSIL_STONE],
  [Item.DAWN_STONE]: [Item.FOSSIL_STONE, Item.TWISTED_SPOON],
  [Item.WATER_STONE]: [Item.FOSSIL_STONE, Item.MYSTIC_WATER],
  [Item.THUNDER_STONE]: [Item.FOSSIL_STONE, Item.MAGNET],
  [Item.FIRE_STONE]: [Item.FOSSIL_STONE, Item.CHARCOAL],
  [Item.MOON_STONE]: [Item.FOSSIL_STONE, Item.HEART_SCALE],
  [Item.DUSK_STONE]: [Item.FOSSIL_STONE, Item.BLACK_GLASSES],
  [Item.LEAF_STONE]: [Item.FOSSIL_STONE, Item.MIRACLE_SEED],
  [Item.ICY_ROCK]: [Item.FOSSIL_STONE, Item.NEVER_MELT_ICE],
  [Item.CHOICE_SPECS]: [Item.TWISTED_SPOON, Item.TWISTED_SPOON],
  [Item.SOUL_DEW]: [Item.TWISTED_SPOON, Item.MYSTIC_WATER],
  [Item.UPGRADE]: [Item.TWISTED_SPOON, Item.MAGNET],
  [Item.REAPER_CLOTH]: [Item.TWISTED_SPOON, Item.BLACK_GLASSES],
  [Item.POKEMONOMICON]: [Item.TWISTED_SPOON, Item.MIRACLE_SEED],
  [Item.WATER_INCENSE]: [Item.TWISTED_SPOON, Item.NEVER_MELT_ICE],
  [Item.SHELL_BELL]: [Item.TWISTED_SPOON, Item.CHARCOAL],
  [Item.LUCKY_EGG]: [Item.TWISTED_SPOON, Item.HEART_SCALE],
  [Item.AQUA_EGG]: [Item.MYSTIC_WATER, Item.MYSTIC_WATER],
  [Item.BLUE_ORB]: [Item.MYSTIC_WATER, Item.MAGNET],
  [Item.ZOOM_LENS]: [Item.MYSTIC_WATER, Item.BLACK_GLASSES],
  [Item.BRIGHT_POWDER]: [Item.MYSTIC_WATER, Item.MIRACLE_SEED],
  [Item.DELTA_ORB]: [Item.MYSTIC_WATER, Item.NEVER_MELT_ICE],
  [Item.MANA_SCARF]: [Item.MYSTIC_WATER, Item.CHARCOAL],
  [Item.SMOKE_BALL]: [Item.MYSTIC_WATER, Item.HEART_SCALE],
  [Item.XRAY_VISION]: [Item.MAGNET, Item.MAGNET],
  [Item.RAZOR_FANG]: [Item.MAGNET, Item.BLACK_GLASSES],
  [Item.LEFTOVERS]: [Item.MAGNET, Item.MIRACLE_SEED],
  [Item.CHOICE_SCARF]: [Item.MAGNET, Item.NEVER_MELT_ICE],
  [Item.FIRE_GEM]: [Item.MAGNET, Item.CHARCOAL],
  [Item.DEFENSIVE_RIBBON]: [Item.MAGNET, Item.HEART_SCALE],
  [Item.WONDER_BOX]: [Item.BLACK_GLASSES, Item.BLACK_GLASSES],
  [Item.RUNE_PROTECT]: [Item.BLACK_GLASSES, Item.MIRACLE_SEED],
  [Item.WIDE_LENS]: [Item.BLACK_GLASSES, Item.NEVER_MELT_ICE],
  [Item.RAZOR_CLAW]: [Item.BLACK_GLASSES, Item.CHARCOAL],
  [Item.FLUFFY_TAIL]: [Item.BLACK_GLASSES, Item.HEART_SCALE],
  [Item.ORAN_BERRY]: [Item.MIRACLE_SEED, Item.MIRACLE_SEED],
  [Item.SHINY_CHARM]: [Item.MIRACLE_SEED, Item.NEVER_MELT_ICE],
  [Item.FOCUS_BAND]: [Item.MIRACLE_SEED, Item.CHARCOAL],
  [Item.FLAME_ORB]: [Item.MIRACLE_SEED, Item.HEART_SCALE],
  [Item.ASSAULT_VEST]: [Item.NEVER_MELT_ICE, Item.NEVER_MELT_ICE],
  [Item.KINGS_ROCK]: [Item.NEVER_MELT_ICE, Item.CHARCOAL],
  [Item.POKE_DOLL]: [Item.NEVER_MELT_ICE, Item.HEART_SCALE],
  [Item.RED_ORB]: [Item.CHARCOAL, Item.CHARCOAL],
  [Item.MAX_REVIVE]: [Item.CHARCOAL, Item.HEART_SCALE],
  [Item.ROCKY_HELMET]: [Item.HEART_SCALE, Item.HEART_SCALE]
}

export const ItemStats: Record<Item, { [stat in Stat]?: number }> = {
  [Item.FOSSIL_STONE]: {},
  [Item.TWISTED_SPOON]: { [Stat.SPELL_POWER]: 10 },
  [Item.MAGNET]: { [Stat.ATK_SPEED]: 10 },
  [Item.BLACK_GLASSES]: { [Stat.CRIT_CHANCE]: 5 },
  [Item.MIRACLE_SEED]: { [Stat.SHIELD]: 15 },
  [Item.CHARCOAL]: { [Stat.ATK]: 1 },
  [Item.NEVER_MELT_ICE]: { [Stat.SPE_DEF]: 1 },
  [Item.HEART_SCALE]: { [Stat.DEF]: 1 },
  [Item.MYSTIC_WATER]: { [Stat.MANA]: 15 },
  [Item.OLD_AMBER]: {},
  [Item.DAWN_STONE]: { [Stat.SPELL_POWER]: 10 },
  [Item.WATER_STONE]: { [Stat.MANA]: 15 },
  [Item.THUNDER_STONE]: { [Stat.ATK_SPEED]: 10 },
  [Item.FIRE_STONE]: { [Stat.ATK]: 1 },
  [Item.MOON_STONE]: { [Stat.DEF]: 1 },
  [Item.DUSK_STONE]: { [Stat.CRIT_CHANCE]: 5 },
  [Item.LEAF_STONE]: { [Stat.SHIELD]: 15 },
  [Item.ICY_ROCK]: { [Stat.SPE_DEF]: 1 },
  [Item.CHOICE_SPECS]: { [Stat.SPELL_POWER]: 100 },
  [Item.SOUL_DEW]: { [Stat.SPELL_POWER]: 10, [Stat.MANA]: 15 },
  [Item.UPGRADE]: { [Stat.SPELL_POWER]: 10, [Stat.ATK_SPEED]: 10 },
  [Item.REAPER_CLOTH]: { [Stat.SPELL_POWER]: 10, [Stat.CRIT_CHANCE]: 5 },
  [Item.POKEMONOMICON]: { [Stat.SPELL_POWER]: 10, [Stat.SHIELD]: 15 },
  [Item.WATER_INCENSE]: { [Stat.SPELL_POWER]: 10, [Stat.SPE_DEF]: 1 },
  [Item.SHELL_BELL]: { [Stat.SPELL_POWER]: 10, [Stat.ATK]: 1 },
  [Item.LUCKY_EGG]: { [Stat.SPELL_POWER]: 10, [Stat.DEF]: 1 },
  [Item.AQUA_EGG]: { [Stat.MANA]: 30 },
  [Item.BLUE_ORB]: { [Stat.MANA]: 15, [Stat.ATK_SPEED]: 10 },
  [Item.ZOOM_LENS]: { [Stat.MANA]: 15, [Stat.CRIT_CHANCE]: 5 },
  [Item.BRIGHT_POWDER]: { [Stat.MANA]: 15, [Stat.SHIELD]: 15 },
  [Item.DELTA_ORB]: { [Stat.MANA]: 15, [Stat.SPE_DEF]: 1 },
  [Item.MANA_SCARF]: { [Stat.MANA]: 15, [Stat.ATK]: 1 },
  [Item.SMOKE_BALL]: { [Stat.MANA]: 15, [Stat.DEF]: 1 },
  [Item.XRAY_VISION]: { [Stat.ATK_SPEED]: 50 },
  [Item.RAZOR_FANG]: {
    [Stat.ATK_SPEED]: 10,
    [Stat.CRIT_CHANCE]: 5,
    [Stat.CRIT_DAMAGE]: 100
  },
  [Item.LEFTOVERS]: { [Stat.ATK_SPEED]: 10, [Stat.SHIELD]: 15 },
  [Item.CHOICE_SCARF]: { [Stat.ATK_SPEED]: 10, [Stat.SPE_DEF]: 1 },
  [Item.FIRE_GEM]: { [Stat.ATK_SPEED]: 10, [Stat.ATK]: 1 },
  [Item.DEFENSIVE_RIBBON]: { [Stat.ATK_SPEED]: 10, [Stat.DEF]: 1 },
  [Item.WONDER_BOX]: { [Stat.CRIT_CHANCE]: 10 },
  [Item.RUNE_PROTECT]: { [Stat.CRIT_CHANCE]: 5, [Stat.SHIELD]: 15 },
  [Item.WIDE_LENS]: { [Stat.CRIT_CHANCE]: 5, [Stat.SPE_DEF]: 1 },
  [Item.RAZOR_CLAW]: { [Stat.CRIT_CHANCE]: 55, [Stat.ATK]: 1 },
  [Item.FLUFFY_TAIL]: { [Stat.CRIT_CHANCE]: 5, [Stat.SPE_DEF]: 1 },
  [Item.ORAN_BERRY]: { [Stat.SHIELD]: 130 },
  [Item.SHINY_CHARM]: { [Stat.SHIELD]: 15, [Stat.SPE_DEF]: 1 },
  [Item.FOCUS_BAND]: { [Stat.SHIELD]: 15, [Stat.ATK]: 1 },
  [Item.FLAME_ORB]: { [Stat.SHIELD]: 15, [Stat.DEF]: 1 },
  [Item.ASSAULT_VEST]: { [Stat.SPE_DEF]: 18 },
  [Item.KINGS_ROCK]: { [Stat.SPE_DEF]: 1, [Stat.ATK]: 1 },
  [Item.POKE_DOLL]: { [Stat.SPE_DEF]: 1, [Stat.DEF]: 1 },
  [Item.RED_ORB]: { [Stat.ATK]: 10 },
  [Item.MAX_REVIVE]: { [Stat.ATK]: 1, [Stat.DEF]: 1 },
  [Item.ROCKY_HELMET]: { [Stat.DEF]: 12 }
}

export type DungeonInfo = {
  id: string
  name: string
  pokemons: Pkm[]
  tileset: Header[]
  type: Synergy
}

export enum Dungeon {
  FOURTH_STATION_PATH = "FOURTH_STATION_PATH",
  SEVEN_STATION_PATH = "SEVEN_STATION_PATH",
  BARREN_VALLEY = "BARREN_VALLEY",
  DARK_ICE_MOUNTAIN_PEAK = "DARK_ICE_MOUNTAIN_PEAK",
  DARK_WASTELAND = "DARK_WASTELAND",
  DEEP_BOULDER_QUARRY = "DEEP_BOULDER_QUARRY",
  LIMESTONE_CAVERN = "LIMESTONE_CAVERN",
  DEEP_LIMESTONE_CAVERN = "DEEP_LIMESTONE_CAVERN",
  ICICLE_FOREST = "ICICLE_FOREST",
  MURKY_FOREST = "MURKY_FOREST",
  SPACIAL_CLIFFS = "SPACIAL_CLIFFS",
  TEMPORAL_SPIRE_FUTURE = "TEMPORAL_SPIRE_FUTURE",
  TEMPORAL_TOWER_FUTURE = "TEMPORAL_TOWER_FUTURE",
  VAST_ICE_MOUNTAIN_PEAK = "VAST_ICE_MOUNTAIN_PEAK",
  VAST_ICE_MOUNTAIN = "VAST_ICE_MOUNTAIN",
  AMP_PLAINS = "AMP_PLAINS",
  FAR_AMP_PLAINS = "FAR_AMP_PLAINS",
  FINAL_MAZE_B23F = "FINAL_MAZE_B23F",
  FOGGY_FOREST = "FOGGY_FOREST",
  FOREST_PATH = "FOREST_PATH",
  GOLD_CHAMBER = "GOLD_CHAMBER",
  HIDDEN_HIGHLAND = "HIDDEN_HIGHLAND",
  MYSTERY_JUNGLE_01F_15F = "MYSTERY_JUNGLE_01F_15F",
  MYSTERY_JUNGLE_16F_30F = "MYSTERY_JUNGLE_16F_30F",
  MYSTIFYING_FOREST = "MYSTIFYING_FOREST",
  BEACH_CAVE = "BEACH_CAVE",
  BOTTOMLESS_SEA = "BOTTOMLESS_SEA",
  BRINE_CAVE = "BRINE_CAVE",
  CONCEALED_RUINS = "CONCEALED_RUINS",
  CRAGGY_COAST = "CRAGGY_COAST",
  CRYSTAL_CAVE_01F_05F = "CRYSTAL_CAVE_01F_05F",
  CRYSTAL_CAVE_06F_11F = "CRYSTAL_CAVE_06F_11F",
  CRYSTAL_CROSSING = "CRYSTAL_CROSSING",
  DARK_CRATER = "DARK_CRATER",
  DEEP_DARK_CRATER = "DEEP_DARK_CRATER",
  DARK_HILL_01F_06F = "DARK_HILL_01F_06F",
  DARK_HILL_07F_15F = "DARK_HILL_07F_15F",
  DEEP_DUSK_FOREST_01F_06F = "DEEP_DUSK_FOREST_01F_06F",
  DEEP_DUSK_FOREST_07F_12F = "DEEP_DUSK_FOREST_07F_12F",
  DEEP_SEALED_RUIN = "DEEP_SEALED_RUIN",
  DRENCHED_BLUFF = "DRENCHED_BLUFF",
  DUSK_FOREST_01F_04F = "DUSK_FOREST_01F_04F",
  DUSK_FOREST_05F_08F = "DUSK_FOREST_05F_08F",
  NORTHERN_DESERT_01F_07F = "NORTHERN_DESERT_01F_07F",
  QUICKSAND_CAVE = "QUICKSAND_CAVE",
  QUICKSAND_PIT = "QUICKSAND_PIT",
  ROCK_AEGIS_CAVE = "ROCK_AEGIS_CAVE",
  SURROUNDED_SEA = "SURROUNDED_SEA",
  TEMPORAL_SPIRE = "TEMPORAL_SPIRE",
  TEMPORAL_TOWER = "TEMPORAL_TOWER",
  TEST_DUNGEON = "TEST_DUNGEON",
  THE_NIGHTMARE = "THE_NIGHTMARE",
  TINY_MEADOW = "TINY_MEADOW",
  TREESHROUD_FOREST_01F_08F = "TREESHROUD_FOREST_01F_08F",
  TREESHROUD_FOREST_09F_21F = "TREESHROUD_FOREST_09F_21F",
  STEAM_CAVE = "STEAM_CAVE",
  QUICKSAND_PIT_2 = "QUICKSAND_PIT_2",
  LOWER_BRINE_CAVE = "LOWER_BRINE_CAVE",
  TEMPORAL_TOWER_2 = "TEMPORAL_TOWER_2",
  CRYSTAL_CAVE_2 = "CRYSTAL_CAVE_2",
  WATERFALL_CAVE = "WATERFALL_CAVE",
  WORLD_ABYSS = "WORLD_ABYSS",
  ZERO_ISLE_EAST_15F_25F = "ZERO_ISLE_EAST_15F_25F",
  ZERO_ISLE_EAST_26F_40F = "ZERO_ISLE_EAST_26F_40F",
  ZERO_ISLE_SOUTH_04F_08F = "ZERO_ISLE_SOUTH_04F_08F",
  ZERO_ISLE_SOUTH_01F_03F = "ZERO_ISLE_SOUTH_01F_03F",
  BURIED_RELIC_1F_20F = "BURIED_RELIC_1F_20F",
  BURIED_RELIC_21F_50F = "BURIED_RELIC_21F_50F",
  BURIED_RELIC_51F_99F = "BURIED_RELIC_51F_99F",
  DARKNIGHT_RELIC = "DARKNIGHT_RELIC",
  SHIMMER_DESERT = "SHIMMER_DESERT",
  UNOWN_RELIC = "UNOWN_RELIC",
  FROSTY_FOREST = "FROSTY_FOREST",
  GREAT_CANYON = "GREAT_CANYON",
  HOWLING_FOREST_01F_06F = "HOWLING_FOREST_01F_06F",
  HOWLING_FOREST_07F_15F = "HOWLING_FOREST_07F_15F",
  MT_FARAWAY = "MT_FARAWAY",
  MT_FARAWAY_10F_20F = "MT_FARAWAY_10F_20F",
  MT_FARAWAY_30F_39F = "MT_FARAWAY_30F_39F",
  JOYOUS_TOWER = "JOYOUS_TOWER",
  LAPIS_CAVE = "LAPIS_CAVE",
  LIGHTNING_FIELD = "LIGHTNING_FIELD",
  MAGMA_CAVERN_08F_17F = "MAGMA_CAVERN_08F_17F",
  MAGMA_CAVERN_18F_23F = "MAGMA_CAVERN_18F_23F",
  METEOR_CAVE = "METEOR_CAVE",
  MT_BLAZE = "MT_BLAZE",
  MT_STEEL_01F_05F = "MT_STEEL_01F_05F",
  MT_STEEL_06F_08F = "MT_STEEL_06F_08F",
  MT_FREEZE = "MT_FREEZE",
  MT_THUNDER_PEAK = "MT_THUNDER_PEAK",
  MT_THUNDER = "MT_THUNDER",
  MURKY_CAVE = "MURKY_CAVE",
  NORMAL_MAZE = "NORMAL_MAZE",
  NORTHERN_RANGE_01F_07F = "NORTHERN_RANGE_01F_07F",
  NORTHERN_RANGE_08F_16F = "NORTHERN_RANGE_08F_16F",
  NORTHWIND_FIELD = "NORTHWIND_FIELD",
  PITFALL_VALLEY = "PITFALL_VALLEY",
  POISON_MAZE = "POISON_MAZE",
  PURITY_FOREST_04F_07F = "PURITY_FOREST_04F_07F",
  PURITY_FOREST_13F_20F = "PURITY_FOREST_13F_20F",
  PURITY_FOREST_30F_43F = "PURITY_FOREST_30F_43F",
  PURITY_FOREST_44F_60F = "PURITY_FOREST_44F_60F",
  PURITY_FOREST_61F_79F = "PURITY_FOREST_61F_79F",
  PURITY_FOREST_80F_99F = "PURITY_FOREST_80F_99F",
  RESCUE_TEAM_MAZE = "RESCUE_TEAM_MAZE",
  ROCK_PATH = "ROCK_PATH",
  SILENT_CHASM = "SILENT_CHASM",
  SILVER_TRENCH = "SILVER_TRENCH",
  SINISTER_WOODS = "SINISTER_WOODS",
  SKY_TOWER = "SKY_TOWER",
  SNOW_PATH = "SNOW_PATH",
  SOLAR_CAVE = "SOLAR_CAVE",
  SOUTHERN_CAVERN_01F_23F = "SOUTHERN_CAVERN_01F_23F",
  SOUTHERN_CAVERN_24F_50F = "SOUTHERN_CAVERN_24F_50F",
  STORMY_SEA_01F_16F = "STORMY_SEA_01F_16F",
  STORMY_SEA_16F_39F = "STORMY_SEA_16F_39F",
  THUNDERWAVE_CAVE = "THUNDERWAVE_CAVE",
  TINY_WOODS = "TINY_WOODS",
  UPROAR_FOREST = "UPROAR_FOREST",
  SERENITY_RIVER = "SERENITY_RIVER",
  WATERFALL_POND = "WATERFALL_POND",
  WESTERN_CAVE_B01F_B27F = "WESTERN_CAVE_B01F_B27F",
  WESTERN_CAVE_B28F_B39F = "WESTERN_CAVE_B28F_B39F",
  WISH_CAVE_01F_13F = "WISH_CAVE_01F_13F",
  WISH_CAVE_90F_99F = "WISH_CAVE_90F_99F",
  WYVERN_HILL = "WYVERN_HILL"
}

export const DungeonData: { [key in Dungeon]: DungeonInfo } = Object.freeze({
  FOURTH_STATION_PATH: {
    id: "FOURTH_STATION_PATH",
    name: "4th Station Path",
    pokemons: [],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.GRASS
  },
  SEVEN_STATION_PATH: {
    id: "SEVEN_STATION_PATH",
    name: "7th Station Path",
    pokemons: [],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.FIGHTING
  },
  BARREN_VALLEY: {
    id: "BARREN_VALLEY",
    name: "Barren Valley",
    pokemons: [],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.DARK
  },
  DARK_ICE_MOUNTAIN_PEAK: {
    id: "DARK_ICE_MOUNTAIN_PEAK",
    name: "Dark Ice Mountain Peak",
    pokemons: [Pkm.GENGAR, Pkm.DUSKULL, Pkm.METANG],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GHOST
  },
  DARK_ICE_MOUNTAIN: {
    id: "DARK_ICE_MOUNTAIN",
    name: "Dark Ice Mountain",
    pokemons: [Pkm.BANETTE, Pkm.GENGAR, Pkm.DUSKULL, Pkm.METANG],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GHOST
  },
  DARK_WASTELAND: {
    id: "DARK_WASTELAND",
    name: "Dark Wasteland",
    pokemons: [Pkm.GASTLY, Pkm.ONIX, Pkm.SHIFTRY],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GHOST
  },
  DEEP_BOULDER_QUARRY: {
    id: "DEEP_BOULDER_QUARRY",
    name: "Deep Boulder Quarry",
    pokemons: [Pkm.NINJASK, Pkm.SHELGON, Pkm.RHYDON, Pkm.METANG, Pkm.STEELIX],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.GROUND
  },
  LIMESTONE_CAVERN: {
    id: "LIMESTONE_CAVERN",
    name: "Limestone Cavern",
    pokemons: [Pkm.MARILL, Pkm.SLOWKING, Pkm.DRAGONAIR],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.WATER
  },
  DEEP_LIMESTONE_CAVERN: {
    id: "DEEP_LIMESTONE_CAVERN",
    name: "Deep Limestone Cavern",
    pokemons: [Pkm.DRAGONAIR, Pkm.AERODACTYL, Pkm.POLIWHIRL],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.WATER
  },
  ICICLE_FOREST: {
    id: "ICICLE_FOREST",
    name: "Icicle Forest",
    pokemons: [Pkm.GENGAR, Pkm.CACTURNE, Pkm.METAGROSS],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.ICE
  },
  MURKY_FOREST: {
    id: "MURKY_FOREST",
    name: "Murky Forest",
    pokemons: [Pkm.HOPPIP, Pkm.WEEDLE],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.BUG
  },
  SPACIAL_CLIFFS: {
    id: "SPACIAL_CLIFFS",
    name: "Spacial Cliffs",
    pokemons: [Pkm.HAUNTER, Pkm.BELDUM, Pkm.SHEDNINJA, Pkm.BANETTE],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GHOST
  },
  TEMPORAL_SPIRE_FUTURE: {
    id: "TEMPORAL_SPIRE_FUTURE",
    name: "Temporal Spire Future",
    pokemons: [
      Pkm.GOLBAT,
      Pkm.ALAKAZAM,
      Pkm.MAGNETON,
      Pkm.GASTLY,
      Pkm.PORYGON_2,
      Pkm.CROBAT
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.PSYCHIC
  },
  TEMPORAL_TOWER_FUTURE: {
    id: "TEMPORAL_TOWER_FUTURE",
    name: "Temporal Tower Future",
    pokemons: [Pkm.ZUBAT, Pkm.KADABRA, Pkm.MAGNEMITE, Pkm.GASTLY, Pkm.GOLBAT],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.PSYCHIC
  },
  VAST_ICE_MOUNTAIN_PEAK: {
    id: "VAST_ICE_MOUNTAIN_PEAK",
    name: "Vast Ice Mountain Peak",
    pokemons: [
      Pkm.GENGAR,
      Pkm.AERODACTYL,
      Pkm.DUSCLOPS,
      Pkm.ABSOL,
      Pkm.METAGROSS,
      Pkm.MAGNEZONE
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GHOST
  },
  VAST_ICE_MOUNTAIN: {
    id: "VAST_ICE_MOUNTAIN",
    name: "Vast Ice Mountain",
    pokemons: [
      Pkm.GENGAR,
      Pkm.AERODACTYL,
      Pkm.DUSCLOPS,
      Pkm.ABSOL,
      Pkm.METAGROSS,
      Pkm.MAGNEZONE
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GHOST
  },
  AMP_PLAINS: {
    id: "AMP_PLAINS",
    name: "Amp Plains",
    pokemons: [
      Pkm.MAREEP,
      Pkm.ELEKID,
      Pkm.SHINX,
      Pkm.ZAPDOS,
      Pkm.FLAFFY,
      Pkm.PIKACHU,
      Pkm.PICHU,
      Pkm.ELECTABUZZ
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.ELECTRIC
  },
  FAR_AMP_PLAINS: {
    id: "FAR_AMP_PLAINS",
    name: "Far Amp Plains",
    pokemons: [
      Pkm.SHINX,
      Pkm.PIKACHU,
      Pkm.PICHU,
      Pkm.FLAFFY,
      Pkm.ELECTABUZZ,
      Pkm.ELECTRIKE,
      Pkm.LUXIO,
      Pkm.LUXRAY,
      Pkm.AMPHAROS
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.ELECTRIC
  },
  FINAL_MAZE_B23F: {
    id: "FINAL_MAZE_B23F",
    name: "Final Maze",
    pokemons: [
      Pkm.MACHOP,
      Pkm.MAGNEMITE,
      Pkm.OMANYTE,
      Pkm.KABUTO,
      Pkm.MAREEP,
      Pkm.SWINUB,
      Pkm.HOUNDOUR,
      Pkm.MAGBY,
      Pkm.MEDITITE,
      Pkm.BAGON,
      Pkm.STARAVIA,
      Pkm.JIRACHI,
      Pkm.MOLTRES,
      Pkm.SUICUNE
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.GRASS
  },
  FOGGY_FOREST: {
    id: "FOGGY_FOREST",
    name: "Foggy Forest",
    pokemons: [Pkm.SKIPLOOM, Pkm.BUNEARY],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.NORMAL
  },
  FOREST_PATH: {
    id: "FOREST_PATH",
    name: "Forest Path",
    pokemons: [Pkm.SWINUB, Pkm.HOUNDOUR],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GRASS
  },
  GOLD_CHAMBER: {
    id: "GOLD_CHAMBER",
    name: "Gold Chamber",
    pokemons: [
      Pkm.MACHOP,
      Pkm.MAGNEMITE,
      Pkm.OMANYTE,
      Pkm.KABUTO,
      Pkm.MAREEP,
      Pkm.SWINUB,
      Pkm.HOUNDOUR,
      Pkm.MAGBY,
      Pkm.MEDITITE,
      Pkm.BAGON,
      Pkm.STARAVIA,
      Pkm.JIRACHI,
      Pkm.MOLTRES,
      Pkm.SUICUNE
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.NORMAL
  },
  HIDDEN_HIGHLAND: {
    id: "HIDDEN_HIGHLAND",
    name: "Hidden Highland",
    pokemons: [
      Pkm.DRAGONITE,
      Pkm.MANECTRIC,
      Pkm.RAMPARDOS,
      Pkm.BASTIODON,
      Pkm.GARCHOMP,
      Pkm.ABOMASNOW,
      Pkm.MAGMORTAR
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GRASS
  },
  MYSTERY_JUNGLE_01F_15F: {
    id: "MYSTERY_JUNGLE_01F_15F",
    name: "Mystery Jungle",
    pokemons: [
      Pkm.BULBASAUR,
      Pkm.IVYSAUR,
      Pkm.VENUSAUR,
      Pkm.METAPOD,
      Pkm.RATTATA,
      Pkm.RATICATE,
      Pkm.SPEAROW,
      Pkm.NIDORANF,
      Pkm.NIDORANM,
      Pkm.VILEPLUME,
      Pkm.BELLSPROUT,
      Pkm.WEEPINBELL,
      Pkm.VICTREEBEL,
      Pkm.SCYTHER,
      Pkm.CHIKORITA,
      Pkm.BAYLEEF,
      Pkm.MEGANIUM,
      Pkm.TREECKO,
      Pkm.GROVYLE,
      Pkm.SCEPTILE,
      Pkm.SEEDOT,
      Pkm.NUZLEAF,
      Pkm.ROSELIA,
      Pkm.FLYGON,
      Pkm.MUNCHLAX,
      Pkm.TURTWIG,
      Pkm.GROTLE,
      Pkm.TORTERRA
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.WALL_ALT_3,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GRASS
  },
  MYSTERY_JUNGLE_16F_30F: {
    id: "MYSTERY_JUNGLE_16F_30F",
    name: "Mystery Jungle",
    pokemons: [
      Pkm.BULBASAUR,
      Pkm.IVYSAUR,
      Pkm.VENUSAUR,
      Pkm.METAPOD,
      Pkm.RATTATA,
      Pkm.RATICATE,
      Pkm.SPEAROW,
      Pkm.NIDORANF,
      Pkm.NIDORANM,
      Pkm.VILEPLUME,
      Pkm.BELLSPROUT,
      Pkm.WEEPINBELL,
      Pkm.VICTREEBEL,
      Pkm.SCYTHER,
      Pkm.CHIKORITA,
      Pkm.BAYLEEF,
      Pkm.MEGANIUM,
      Pkm.TREECKO,
      Pkm.GROVYLE,
      Pkm.SCEPTILE,
      Pkm.SEEDOT,
      Pkm.NUZLEAF,
      Pkm.ROSELIA,
      Pkm.FLYGON,
      Pkm.MUNCHLAX,
      Pkm.TURTWIG,
      Pkm.GROTLE,
      Pkm.TORTERRA
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GRASS
  },
  MYSTIFYING_FOREST: {
    id: "MYSTIFYING_FOREST",
    name: "Mystifying Forest",
    pokemons: [
      Pkm.CELEBI,
      Pkm.DARKRAI,
      Pkm.BULBASAUR,
      Pkm.IVYSAUR,
      Pkm.VENUSAUR,
      Pkm.METAPOD,
      Pkm.RATTATA,
      Pkm.RATICATE,
      Pkm.SPEAROW,
      Pkm.NIDORANF,
      Pkm.NIDORANM,
      Pkm.VILEPLUME,
      Pkm.BELLSPROUT,
      Pkm.WEEPINBELL,
      Pkm.VICTREEBEL,
      Pkm.SCYTHER,
      Pkm.CHIKORITA,
      Pkm.BAYLEEF,
      Pkm.MEGANIUM,
      Pkm.TREECKO,
      Pkm.GROVYLE,
      Pkm.SCEPTILE,
      Pkm.SEEDOT,
      Pkm.NUZLEAF,
      Pkm.ROSELIA,
      Pkm.FLYGON,
      Pkm.MUNCHLAX,
      Pkm.TURTWIG,
      Pkm.GROTLE,
      Pkm.TORTERRA
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GRASS
  },
  BEACH_CAVE: {
    id: "BEACH_CAVE",
    name: "Beach Cave",
    pokemons: [Pkm.KABUTO],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.GROUND_ALT_4,
      Header.WATER
    ],
    type: Synergy.WATER
  },
  BOTTOMLESS_SEA: {
    id: "BOTTOMLESS_SEA",
    name: "Bottomless Sea",
    pokemons: [
      Pkm.KYOGRE,
      Pkm.GYARADOS,
      Pkm.KINGDRA,
      Pkm.SLOWBRO,
      Pkm.HORSEA,
      Pkm.SEADRA,
      Pkm.SLOWKING,
      Pkm.LAPRAS
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.WATER
    ],
    type: Synergy.WATER
  },
  BRINE_CAVE: {
    id: "BRINE_CAVE",
    name: "Brine Cave",
    pokemons: [Pkm.OMANYTE, Pkm.DRAGONAIR],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.WATER
  },
  CONCEALED_RUINS: {
    id: "CONCEALED_RUINS",
    name: "Concealed Ruins",
    pokemons: [
      Pkm.PIDGEY,
      Pkm.LOUDRED,
      Pkm.NIDOQUEEN,
      Pkm.SHUPPET,
      Pkm.RAIKOU,
      Pkm.PIDGEOT
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.NORMAL
  },
  CRAGGY_COAST: {
    id: "CRAGGY_COAST",
    name: "Craggy Coast",
    pokemons: [Pkm.SPHEAL, Pkm.DRATINI, Pkm.SEALEO],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.WATER
  },
  CRYSTAL_CAVE_01F_05F: {
    id: "CRYSTAL_CAVE_01F_05F",
    name: "Crystal Cave",
    pokemons: [Pkm.GRAVELER, Pkm.BELDUM, Pkm.CRANIDOS, Pkm.SHIELDON, Pkm.GOLEM],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GROUND
  },
  CRYSTAL_CAVE_06F_11F: {
    id: "CRYSTAL_CAVE_06F_11F",
    name: "Crystal Cave",
    pokemons: [Pkm.GRAVELER, Pkm.BELDUM, Pkm.CRANIDOS, Pkm.SHIELDON, Pkm.GOLEM],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GROUND
  },
  CRYSTAL_CROSSING: {
    id: "CRYSTAL_CROSSING",
    name: "Crystal Crossing",
    pokemons: [Pkm.BAGON, Pkm.ABSOL, Pkm.GLALIE, Pkm.FROSLASS, Pkm.AZELF],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GROUND
  },
  DARK_CRATER: {
    id: "DARK_CRATER",
    name: "Dark Crater",
    pokemons: [
      Pkm.CHARMANDER,
      Pkm.CYNDAQUIL,
      Pkm.NUMEL,
      Pkm.GROWLITHE,
      Pkm.PONYTA,
      Pkm.TORCHIC,
      Pkm.FLAREON,
      Pkm.COMBUSKEN,
      Pkm.RAPIDASH,
      Pkm.MEWTWO,
      Pkm.ARCANINE,
      Pkm.QUILAVA
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.FIRE
  },
  DEEP_DARK_CRATER: {
    id: "DEEP_DARK_CRATER",
    name: "Deep Dark Crater",
    pokemons: [
      Pkm.CHARMELEON,
      Pkm.QUILAVA,
      Pkm.MONFERNO,
      Pkm.CAMERUPT,
      Pkm.COMBUSKEN,
      Pkm.ARCANINE,
      Pkm.RAPIDASH,
      Pkm.FLAREON,
      Pkm.RHYPERIOR,
      Pkm.MAGMORTAR,
      Pkm.CHARIZARD,
      Pkm.TYPHLOSION,
      Pkm.INFERNAPE,
      Pkm.BLAZIKEN,
      Pkm.AGGRON,
      Pkm.ENTEI
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.FIRE
  },
  DARK_HILL_01F_06F: {
    id: "DARK_HILL_01F_06F",
    name: "Dark Hill",
    pokemons: [Pkm.GASTLY, Pkm.HAUNTER, Pkm.GENGAR, Pkm.BANETTE, Pkm.DUSCLOPS],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GHOST
  },
  DARK_HILL_07F_15F: {
    id: "DARK_HILL_07F_15F",
    name: "Dark Hill",
    pokemons: [Pkm.GASTLY, Pkm.HAUNTER, Pkm.GENGAR, Pkm.BANETTE, Pkm.DUSCLOPS],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GHOST
  },
  DEEP_DUSK_FOREST_01F_06F: {
    id: "DEEP_DUSK_FOREST_01F_06F",
    name: "Deep Dusk Forest",
    pokemons: [Pkm.RHYDON, Pkm.STEELIX, Pkm.AGGRON, Pkm.LEAFEON],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GROUND
  },
  DEEP_DUSK_FOREST_07F_12F: {
    id: "DEEP_DUSK_FOREST_07F_12F",
    name: "Deep Dusk Forest",
    pokemons: [Pkm.RHYDON, Pkm.STEELIX, Pkm.AGGRON, Pkm.LEAFEON],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GROUND
  },
  DEEP_SEALED_RUIN: {
    id: "DEEP_SEALED_RUIN",
    name: "Deep Sealed Ruin",
    pokemons: [Pkm.SHELGON, Pkm.METANG],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.METAL
  },
  DRENCHED_BLUFF: {
    id: "DRENCHED_BLUFF",
    name: "Drenched Bluff",
    pokemons: [Pkm.LILEEP, Pkm.ANORITH],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.WATER
  },
  DUSK_FOREST_01F_04F: {
    id: "DUSK_FOREST_01F_04F",
    name: "Dusk Forest",
    pokemons: [
      Pkm.JUMPLUFF,
      Pkm.GABITE,
      Pkm.HAUNTER,
      Pkm.SALAMENCE,
      Pkm.RHYPERIOR
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GHOST
  },
  DUSK_FOREST_05F_08F: {
    id: "DUSK_FOREST_05F_08F",
    name: "Dusk Forest",
    pokemons: [
      Pkm.JUMPLUFF,
      Pkm.GABITE,
      Pkm.HAUNTER,
      Pkm.SALAMENCE,
      Pkm.RHYPERIOR
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GHOST
  },
  NORTHERN_DESERT_01F_07F: {
    id: "NORTHERN_DESERT_01F_07F",
    name: "Northern Desert",
    pokemons: [
      Pkm.CUBONE,
      Pkm.ARON,
      Pkm.CACNEA,
      Pkm.LARVITAR,
      Pkm.TRAPINCH,
      Pkm.RHYHORN,
      Pkm.LAIRON,
      Pkm.CACTURNE
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GROUND
  },
  QUICKSAND_CAVE: {
    id: "QUICKSAND_CAVE",
    name: "Quicksand Cave",
    pokemons: [Pkm.NINCADA, Pkm.VIBRAVA],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GROUND
  },
  QUICKSAND_PIT: {
    id: "QUICKSAND_PIT",
    name: "Quicksand Pit",
    pokemons: [Pkm.MESPRIT, Pkm.TYRANITAR, Pkm.NINJASK],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GROUND
  },
  ROCK_AEGIS_CAVE: {
    id: "ROCK_AEGIS_CAVE",
    name: "Rock Aegis Cave",
    pokemons: [Pkm.ZUBAT, Pkm.GOLBAT, Pkm.MACHOKE, Pkm.MACHAMP, Pkm.REGIROCK],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.MINERAL
  },
  SURROUNDED_SEA: {
    id: "SURROUNDED_SEA",
    name: "Surrounded Sea",
    pokemons: [
      Pkm.CARVANHA,
      Pkm.SLOWBRO,
      Pkm.HORSEA,
      Pkm.SEADRA,
      Pkm.SLOWKING,
      Pkm.KINGDRA,
      Pkm.LAPRAS,
      Pkm.LUGIA
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.WATER
    ],
    type: Synergy.WATER
  },
  TEMPORAL_SPIRE: {
    id: "TEMPORAL_SPIRE",
    name: "Temporal Spire",
    pokemons: [
      Pkm.DIALGA,
      Pkm.DEOXYS,
      Pkm.PORYGON,
      Pkm.SALAMENCE,
      Pkm.PORYGON_Z,
      Pkm.METAGROSS
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.METAL
  },
  TEMPORAL_TOWER: {
    id: "TEMPORAL_TOWER",
    name: "Temporal Tower",
    pokemons: [Pkm.PORYGON],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.PSYCHIC
  },
  TEST_DUNGEON: {
    id: "TEST_DUNGEON",
    name: "Test Dungeon",
    pokemons: [Pkm.PORYGON],
    tileset: [Header.WALL, Header.WALL_ALT_1, Header.GROUND, Header.WATER],
    type: Synergy.PSYCHIC
  },
  THE_NIGHTMARE: {
    id: "THE_NIGHTMARE",
    name: "The Nightmare",
    pokemons: [
      Pkm.CLEFFA,
      Pkm.CLEFAIRY,
      Pkm.JIGGLYPUFF,
      Pkm.ESPEON,
      Pkm.WHISMUR,
      Pkm.PERSIAN,
      Pkm.IGGLYBUFF,
      Pkm.CLEFABLE,
      Pkm.WIGGLYTUFF
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.NORMAL
  },
  TINY_MEADOW: {
    id: "TINY_MEADOW",
    name: "Tiny Meadow",
    pokemons: [Pkm.SKIPLOOM, Pkm.STARAVIA],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GRASS
  },
  TREESHROUD_FOREST_01F_08F: {
    id: "TREESHROUD_FOREST_01F_08F",
    name: "Treeshroud Forest",
    pokemons: [Pkm.KADABRA, Pkm.RALTS, Pkm.ALAKAZAM, Pkm.KIRLIA],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.PSYCHIC
  },
  TREESHROUD_FOREST_09F_21F: {
    id: "TREESHROUD_FOREST_09F_21F",
    name: "Treeshroud Forest",
    pokemons: [Pkm.KADABRA, Pkm.RALTS, Pkm.ALAKAZAM, Pkm.KIRLIA],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.PSYCHIC
  },
  STEAM_CAVE: {
    id: "STEAM_CAVE",
    name: "Steam Cave",
    pokemons: [Pkm.MAGBY, Pkm.NUMEL],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.FIRE
  },
  QUICKSAND_PIT_2: {
    id: "QUICKSAND_PIT_2",
    name: "Quicksand Pit",
    pokemons: [Pkm.MESPRIT, Pkm.TYRANITAR, Pkm.NINJASK],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GROUND
  },
  LOWER_BRINE_CAVE: {
    id: "LOWER_BRINE_CAVE",
    name: "Lower Brine Cave",
    pokemons: [Pkm.WALREIN, Pkm.DRAGONAIR],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.WATER
  },
  HIDDEN_LAND: {
    id: "HIDDEN_LAND",
    name: "Hidden land",
    pokemons: [
      Pkm.DRAGONITE,
      Pkm.MANECTRIC,
      Pkm.RAMPARDOS,
      Pkm.BASTIODON,
      Pkm.GARCHOMP,
      Pkm.ABOMASNOW,
      Pkm.MAGMORTAR
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GRASS
  },
  TEMPORAL_TOWER_2: {
    id: "TEMPORAL_TOWER_2",
    name: "Temporal Tower",
    pokemons: [Pkm.PORYGON],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.PSYCHIC
  },
  CRYSTAL_CAVE_2: {
    id: "CRYSTAL_CAVE_2",
    name: "Crystal Cave",
    pokemons: [Pkm.GRAVELER, Pkm.BELDUM, Pkm.CRANIDOS, Pkm.SHIELDON, Pkm.GOLEM],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.GROUND
  },
  WATERFALL_CAVE: {
    id: "WATERFALL_CAVE",
    name: "Waterfall Cave",
    pokemons: [Pkm.POLIWAG, Pkm.LOTAD],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.WATER
  },
  WORLD_ABYSS: {
    id: "WORLD_ABYSS",
    name: "World Abyss",
    pokemons: [
      Pkm.GIRATINA,
      Pkm.PIDGEY,
      Pkm.LOUDRED,
      Pkm.NIDOQUEEN,
      Pkm.UMBREON,
      Pkm.PIDGEOT
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.NORMAL
  },
  ZERO_ISLE_EAST_15F_25F: {
    id: "ZERO_ISLE_EAST_15F_25F",
    name: "Zero Isle East",
    pokemons: [
      Pkm.KABUTO,
      Pkm.AZUMARILL,
      Pkm.SLOWPOKE,
      Pkm.SPEAROW,
      Pkm.SEEDOT,
      Pkm.GOLBAT,
      Pkm.HOUNDOUR,
      Pkm.MAGNETON,
      Pkm.BEEDRILL,
      Pkm.FERALIGATR,
      Pkm.MAGMAR
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.WATER
  },
  ZERO_ISLE_EAST_26F_40F: {
    id: "ZERO_ISLE_EAST_26F_40F",
    name: "Zero Isle East",
    pokemons: [
      Pkm.KABUTO,
      Pkm.AZUMARILL,
      Pkm.SLOWPOKE,
      Pkm.SPEAROW,
      Pkm.SEEDOT,
      Pkm.GOLBAT,
      Pkm.HOUNDOUR,
      Pkm.MAGNETON,
      Pkm.BEEDRILL,
      Pkm.FERALIGATR,
      Pkm.MAGMAR
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.WATER
  },
  ZERO_ISLE_SOUTH_01F_03F: {
    id: "ZERO_ISLE_SOUTH_01F_03F",
    name: "Zero Isle South",
    pokemons: [
      Pkm.PIDGEY,
      Pkm.JIGGLYPUFF,
      Pkm.SEADRA,
      Pkm.CLEFFA,
      Pkm.BELLSPROUT,
      Pkm.NIDORANM,
      Pkm.LARVITAR,
      Pkm.RATTATA,
      Pkm.TOGEPI,
      Pkm.EEVEE,
      Pkm.RALTS
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.NORMAL
  },
  ZERO_ISLE_SOUTH_04F_08F: {
    id: "ZERO_ISLE_SOUTH_04F_08F",
    name: "Zero Isle East",
    pokemons: [
      Pkm.PIDGEY,
      Pkm.JIGGLYPUFF,
      Pkm.SEADRA,
      Pkm.CLEFFA,
      Pkm.BELLSPROUT,
      Pkm.NIDORANM,
      Pkm.LARVITAR,
      Pkm.RATTATA,
      Pkm.TOGEPI,
      Pkm.EEVEE,
      Pkm.RALTS
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.NORMAL
  },
  BURIED_RELIC_1F_20F: {
    id: "BURIED_RELIC_1F_20F",
    name: "Buried Relic",
    pokemons: [
      Pkm.GOLBAT,
      Pkm.RATICATE,
      Pkm.MACHOP,
      Pkm.WHISMUR,
      Pkm.PORYGON,
      Pkm.PORYGON_2,
      Pkm.ARON,
      Pkm.REGIROCK,
      Pkm.GEODUDE,
      Pkm.REGISTEEL,
      Pkm.REGICE,
      Pkm.KADABRA,
      Pkm.SHEDNINJA,
      Pkm.GRAVELER,
      Pkm.HAUNTER,
      Pkm.GOLEM
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.NORMAL
  },
  BURIED_RELIC_21F_50F: {
    id: "BURIED_RELIC_21F_50F",
    name: "Buried Relic",
    pokemons: [
      Pkm.GOLBAT,
      Pkm.RATICATE,
      Pkm.MACHOP,
      Pkm.WHISMUR,
      Pkm.PORYGON,
      Pkm.PORYGON_2,
      Pkm.ARON,
      Pkm.REGIROCK,
      Pkm.GEODUDE,
      Pkm.REGISTEEL,
      Pkm.REGICE,
      Pkm.KADABRA,
      Pkm.SHEDNINJA,
      Pkm.GRAVELER,
      Pkm.HAUNTER,
      Pkm.GOLEM
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GROUND
  },
  BURIED_RELIC_51F_99F: {
    id: "BURIED_RELIC_51F_99F",
    name: "Buried Relic",
    pokemons: [
      Pkm.GOLBAT,
      Pkm.RATICATE,
      Pkm.MACHOP,
      Pkm.WHISMUR,
      Pkm.PORYGON,
      Pkm.PORYGON_2,
      Pkm.ARON,
      Pkm.REGIROCK,
      Pkm.GEODUDE,
      Pkm.REGISTEEL,
      Pkm.REGICE,
      Pkm.KADABRA,
      Pkm.SHEDNINJA,
      Pkm.GRAVELER,
      Pkm.HAUNTER,
      Pkm.GOLEM
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GROUND
  },
  DARKNIGHT_RELIC: {
    id: "DARKNIGHT_RELIC",
    name: "Darknight Relic",
    pokemons: [
      Pkm.SHUPPET,
      Pkm.GASTLY,
      Pkm.SHEDNINJA,
      Pkm.BANETTE,
      Pkm.HAUNTER,
      Pkm.DUSKULL,
      Pkm.GENGAR
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.GHOST
  },
  SHIMMER_DESERT: {
    id: "SHIMMER_DESERT",
    name: "Shimmer Desert",
    pokemons: [Pkm.NIDOKING, Pkm.GARCHOMP, Pkm.RHYPERIOR, Pkm.GROUDON],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GROUND
  },
  UNOWN_RELIC: {
    id: "UNOWN_RELIC",
    name: "Unown Relic",
    pokemons: [],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.PSYCHIC
  },
  FROSTY_FOREST: {
    id: "FROSTY_FOREST",
    name: "Frosty Forest",
    pokemons: [
      Pkm.AZURILL,
      Pkm.PILOSWINE,
      Pkm.LAIRON,
      Pkm.SNORUNT,
      Pkm.ARTICUNO
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.WATER
    ],
    type: Synergy.ICE
  },
  GREAT_CANYON: {
    id: "GREAT_CANYON",
    name: "Great Canyon",
    pokemons: [Pkm.SKIPLOOM, Pkm.VILEPLUME, Pkm.CACTURNE],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.NORMAL
  },
  HOWLING_FOREST_01F_06F: {
    id: "HOWLING_FOREST_01F_06F",
    name: "Howling Forest",
    pokemons: [
      Pkm.AZURILL,
      Pkm.HOUNDOUR,
      Pkm.WHISMUR,
      Pkm.PIDGEY,
      Pkm.LOUDRED,
      Pkm.SNORLAX
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.NORMAL
  },
  HOWLING_FOREST_07F_15F: {
    id: "HOWLING_FOREST_07F_15F",
    name: "Howling Forest",
    pokemons: [
      Pkm.AZURILL,
      Pkm.HOUNDOUR,
      Pkm.WHISMUR,
      Pkm.PIDGEY,
      Pkm.LOUDRED,
      Pkm.SNORLAX
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.NORMAL
  },
  MT_FARAWAY: {
    id: "MT_FARAWAY",
    name: "Mt Faraway",
    pokemons: [
      Pkm.SNORUNT,
      Pkm.AZUMARILL,
      Pkm.GOLEM,
      Pkm.MARSHTOMP,
      Pkm.VIGOROTH,
      Pkm.GLALIE,
      Pkm.HO_OH
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.ICE
  },
  MT_FARAWAY_10F_20F: {
    id: "MT_FARAWAY_10F_20F",
    name: "Mt Faraway",
    pokemons: [
      Pkm.SNORUNT,
      Pkm.AZUMARILL,
      Pkm.GOLEM,
      Pkm.MARSHTOMP,
      Pkm.VIGOROTH,
      Pkm.GLALIE,
      Pkm.HO_OH
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.ICE
  },
  MT_FARAWAY_30F_39F: {
    id: "MT_FARAWAY_30F_39F",
    name: "Mt Faraway",
    pokemons: [
      Pkm.SNORUNT,
      Pkm.AZUMARILL,
      Pkm.GOLEM,
      Pkm.MARSHTOMP,
      Pkm.VIGOROTH,
      Pkm.GLALIE,
      Pkm.HO_OH
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.ICE
  },
  JOYOUS_TOWER: {
    id: "JOYOUS_TOWER",
    name: "Joyous Tower",
    pokemons: [
      Pkm.JIGGLYPUFF,
      Pkm.TREECKO,
      Pkm.BULBASAUR,
      Pkm.PICHU,
      Pkm.METAPOD,
      Pkm.CHIKORITA,
      Pkm.KAKUNA,
      Pkm.CLEFAIRY,
      Pkm.TORCHIC,
      Pkm.EEVEE,
      Pkm.CYNDAQUIL,
      Pkm.BELDUM,
      Pkm.SCYTHER,
      Pkm.SLAKOTH,
      Pkm.TRAPINCH,
      Pkm.CLEFABLE,
      Pkm.HOUNDOUR,
      Pkm.GARDEVOIR,
      Pkm.BELLOSSOM
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.NORMAL
  },
  LAPIS_CAVE: {
    id: "LAPIS_CAVE",
    name: "Lapis Cave",
    pokemons: [
      Pkm.ZUBAT,
      Pkm.NINCADA,
      Pkm.NIDORINA,
      Pkm.NIDORINO,
      Pkm.BAGON,
      Pkm.GOLBAT
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.POISON
  },
  LIGHTNING_FIELD: {
    id: "LIGHTNING_FIELD",
    name: "Lightning Field",
    pokemons: [
      Pkm.MAREEP,
      Pkm.ELECTRIKE,
      Pkm.MAGNEMITE,
      Pkm.PIKACHU,
      Pkm.FLAFFY,
      Pkm.JOLTEON,
      Pkm.CACTURNE,
      Pkm.ELEKID,
      Pkm.MAGNETON,
      Pkm.AMPHAROS,
      Pkm.MANECTRIC,
      Pkm.RAICHU,
      Pkm.RAIKOU
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.WATER
    ],
    type: Synergy.ELECTRIC
  },
  MAGMA_CAVERN_08F_17F: {
    id: "MAGMA_CAVERN_08F_17F",
    name: "Magma Cavern",
    pokemons: [
      Pkm.RATICATE,
      Pkm.NIDOQUEEN,
      Pkm.NIDOKING,
      Pkm.GRAVELER,
      Pkm.MAGMAR,
      Pkm.GOLEM,
      Pkm.ONIX
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.WATER
    ],
    type: Synergy.FIRE
  },
  MAGMA_CAVERN_18F_23F: {
    id: "MAGMA_CAVERN_18F_23F",
    name: "Magma Cavern",
    pokemons: [
      Pkm.GROUDON,
      Pkm.RATICATE,
      Pkm.NIDOQUEEN,
      Pkm.NIDOKING,
      Pkm.GRAVELER,
      Pkm.MAGMAR,
      Pkm.GOLEM,
      Pkm.ONIX
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.FIRE
  },
  METEOR_CAVE: {
    id: "METEOR_CAVE",
    name: "Meteor Cave",
    pokemons: [Pkm.DEOXYS],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.WATER
    ],
    type: Synergy.PSYCHIC
  },
  MT_BLAZE: {
    id: "MT_BLAZE",
    name: "Mt Blaze",
    pokemons: [
      Pkm.PIDGEOT,
      Pkm.MAGBY,
      Pkm.NUMEL,
      Pkm.RAPIDASH,
      Pkm.FEAROW,
      Pkm.ARCANINE,
      Pkm.MOLTRES
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.WATER
    ],
    type: Synergy.FIRE
  },
  MT_STEEL_01F_05F: {
    id: "MT_STEEL_01F_05F",
    name: "Mt Steel",
    pokemons: [Pkm.SPEAROW, Pkm.ARON, Pkm.GEODUDE, Pkm.MEDITITE, Pkm.BELDUM],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.METAL
  },
  MT_STEEL_06F_08F: {
    id: "MT_STEEL_06F_08F",
    name: "Mt Steel",
    pokemons: [Pkm.SPEAROW, Pkm.ARON, Pkm.GEODUDE, Pkm.MEDITITE, Pkm.BELDUM],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.METAL
  },
  MT_FREEZE: {
    id: "MT_FREEZE",
    name: "Mt Freeze",
    pokemons: [Pkm.SWABLU, Pkm.SHELGON, Pkm.VIGOROTH, Pkm.SLAKING],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.ICE
  },
  MT_THUNDER_PEAK: {
    id: "MT_THUNDER_PEAK",
    name: "Mt Thunder Peak",
    pokemons: [
      Pkm.WEEDLE,
      Pkm.NIDORANM,
      Pkm.ELECTRIKE,
      Pkm.CACNEA,
      Pkm.BEEDRILL,
      Pkm.ELECTABUZZ,
      Pkm.AMPHAROS,
      Pkm.MANECTRIC,
      Pkm.GROWLITHE,
      Pkm.ZAPDOS
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.ELECTRIC
  },
  MT_THUNDER: {
    id: "MT_THUNDER",
    name: "Mt Thunder",
    pokemons: [
      Pkm.WEEDLE,
      Pkm.NIDORANM,
      Pkm.ELECTRIKE,
      Pkm.CACNEA,
      Pkm.BEEDRILL,
      Pkm.ELECTABUZZ,
      Pkm.AMPHAROS,
      Pkm.MANECTRIC,
      Pkm.GROWLITHE,
      Pkm.ZAPDOS
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.WATER
    ],
    type: Synergy.ELECTRIC
  },
  MURKY_CAVE: {
    id: "MURKY_CAVE",
    name: "Murky Cave",
    pokemons: [Pkm.ZUBAT, Pkm.GOLBAT, Pkm.SHEDNINJA, Pkm.SHUPPET, Pkm.CROBAT],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.POISON
  },
  NORMAL_MAZE: {
    id: "NORMAL_MAZE",
    name: "Normal Maze",
    pokemons: [Pkm.RATICATE],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.WATER
    ],
    type: Synergy.NORMAL
  },
  NORTHERN_RANGE_01F_07F: {
    id: "NORTHERN_RANGE_01F_07F",
    name: "Northern Range",
    pokemons: [Pkm.NINJASK, Pkm.PIDGEOT, Pkm.FEAROW, Pkm.TOGETIC, Pkm.LATIOS],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.FLYING
  },
  NORTHERN_RANGE_08F_16F: {
    id: "NORTHERN_RANGE_08F_16F",
    name: "Northern Range",
    pokemons: [Pkm.NINJASK, Pkm.PIDGEOT, Pkm.FEAROW, Pkm.TOGETIC, Pkm.LATIOS],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.WATER
    ],
    type: Synergy.FLYING
  },
  NORTHWIND_FIELD: {
    id: "NORTHWIND_FIELD",
    name: "Northwind Field",
    pokemons: [
      Pkm.AZUMARILL,
      Pkm.VAPOREON,
      Pkm.POLIWHIRL,
      Pkm.POLITOED,
      Pkm.ABSOL,
      Pkm.CROCONAW,
      Pkm.WARTORTLE,
      Pkm.SUICUNE
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.WATER
  },
  PITFALL_VALLEY: {
    id: "PITFALL_VALLEY",
    name: "Pitfall Valley",
    pokemons: [
      Pkm.PIDGEOT,
      Pkm.HOPPIP,
      Pkm.BUTTERFREE,
      Pkm.RATICATE,
      Pkm.SWABLU,
      Pkm.SKIPLOOM,
      Pkm.AERODACTYL
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.FLYING
  },
  POISON_MAZE: {
    id: "POISON_MAZE",
    name: "Poison Maze",
    pokemons: [Pkm.NIDORANF, Pkm.NIDORANM, Pkm.NIDORINO, Pkm.NIDORINA],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.POISON
  },
  PURITY_FOREST_04F_07F: {
    id: "PURITY_FOREST_04F_07F",
    name: "Purity Forest",
    pokemons: [
      Pkm.CELEBI,
      Pkm.DARKRAI,
      Pkm.BULBASAUR,
      Pkm.IVYSAUR,
      Pkm.VENUSAUR,
      Pkm.METAPOD,
      Pkm.RATTATA,
      Pkm.RATICATE,
      Pkm.SPEAROW,
      Pkm.NIDORANF,
      Pkm.NIDORANM,
      Pkm.VILEPLUME,
      Pkm.BELLSPROUT,
      Pkm.WEEPINBELL,
      Pkm.VICTREEBEL,
      Pkm.SCYTHER,
      Pkm.CHIKORITA,
      Pkm.BAYLEEF,
      Pkm.MEGANIUM,
      Pkm.TREECKO,
      Pkm.GROVYLE,
      Pkm.SCEPTILE,
      Pkm.SEEDOT,
      Pkm.NUZLEAF,
      Pkm.ROSELIA,
      Pkm.FLYGON,
      Pkm.MUNCHLAX,
      Pkm.TURTWIG,
      Pkm.GROTLE,
      Pkm.TORTERRA
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.GRASS
  },
  PURITY_FOREST_13F_20F: {
    id: "PURITY_FOREST_13F_20F",
    name: "Purity Forest",
    pokemons: [
      Pkm.CELEBI,
      Pkm.DARKRAI,
      Pkm.BULBASAUR,
      Pkm.IVYSAUR,
      Pkm.VENUSAUR,
      Pkm.METAPOD,
      Pkm.RATTATA,
      Pkm.RATICATE,
      Pkm.SPEAROW,
      Pkm.NIDORANF,
      Pkm.NIDORANM,
      Pkm.VILEPLUME,
      Pkm.BELLSPROUT,
      Pkm.WEEPINBELL,
      Pkm.VICTREEBEL,
      Pkm.SCYTHER,
      Pkm.CHIKORITA,
      Pkm.BAYLEEF,
      Pkm.MEGANIUM,
      Pkm.TREECKO,
      Pkm.GROVYLE,
      Pkm.SCEPTILE,
      Pkm.SEEDOT,
      Pkm.NUZLEAF,
      Pkm.ROSELIA,
      Pkm.FLYGON,
      Pkm.MUNCHLAX,
      Pkm.TURTWIG,
      Pkm.GROTLE,
      Pkm.TORTERRA
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.GRASS
  },
  PURITY_FOREST_30F_43F: {
    id: "PURITY_FOREST_30F_43F",
    name: "Purity Forest",
    pokemons: [
      Pkm.CELEBI,
      Pkm.DARKRAI,
      Pkm.BULBASAUR,
      Pkm.IVYSAUR,
      Pkm.VENUSAUR,
      Pkm.METAPOD,
      Pkm.RATTATA,
      Pkm.RATICATE,
      Pkm.SPEAROW,
      Pkm.NIDORANF,
      Pkm.NIDORANM,
      Pkm.VILEPLUME,
      Pkm.BELLSPROUT,
      Pkm.WEEPINBELL,
      Pkm.VICTREEBEL,
      Pkm.SCYTHER,
      Pkm.CHIKORITA,
      Pkm.BAYLEEF,
      Pkm.MEGANIUM,
      Pkm.TREECKO,
      Pkm.GROVYLE,
      Pkm.SCEPTILE,
      Pkm.SEEDOT,
      Pkm.NUZLEAF,
      Pkm.ROSELIA,
      Pkm.FLYGON,
      Pkm.MUNCHLAX,
      Pkm.TURTWIG,
      Pkm.GROTLE,
      Pkm.TORTERRA
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.GRASS
  },
  PURITY_FOREST_44F_60F: {
    id: "PURITY_FOREST_44F_60F",
    name: "Purity Forest",
    pokemons: [
      Pkm.CELEBI,
      Pkm.DARKRAI,
      Pkm.BULBASAUR,
      Pkm.IVYSAUR,
      Pkm.VENUSAUR,
      Pkm.METAPOD,
      Pkm.RATTATA,
      Pkm.RATICATE,
      Pkm.SPEAROW,
      Pkm.NIDORANF,
      Pkm.NIDORANM,
      Pkm.VILEPLUME,
      Pkm.BELLSPROUT,
      Pkm.WEEPINBELL,
      Pkm.VICTREEBEL,
      Pkm.SCYTHER,
      Pkm.CHIKORITA,
      Pkm.BAYLEEF,
      Pkm.MEGANIUM,
      Pkm.TREECKO,
      Pkm.GROVYLE,
      Pkm.SCEPTILE,
      Pkm.SEEDOT,
      Pkm.NUZLEAF,
      Pkm.ROSELIA,
      Pkm.FLYGON,
      Pkm.MUNCHLAX,
      Pkm.TURTWIG,
      Pkm.GROTLE,
      Pkm.TORTERRA
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.GRASS
  },
  PURITY_FOREST_61F_79F: {
    id: "PURITY_FOREST_61F_79F",
    name: "Purity Forest",
    pokemons: [
      Pkm.CELEBI,
      Pkm.DARKRAI,
      Pkm.BULBASAUR,
      Pkm.IVYSAUR,
      Pkm.VENUSAUR,
      Pkm.METAPOD,
      Pkm.RATTATA,
      Pkm.RATICATE,
      Pkm.SPEAROW,
      Pkm.NIDORANF,
      Pkm.NIDORANM,
      Pkm.VILEPLUME,
      Pkm.BELLSPROUT,
      Pkm.WEEPINBELL,
      Pkm.VICTREEBEL,
      Pkm.SCYTHER,
      Pkm.CHIKORITA,
      Pkm.BAYLEEF,
      Pkm.MEGANIUM,
      Pkm.TREECKO,
      Pkm.GROVYLE,
      Pkm.SCEPTILE,
      Pkm.SEEDOT,
      Pkm.NUZLEAF,
      Pkm.ROSELIA,
      Pkm.FLYGON,
      Pkm.MUNCHLAX,
      Pkm.TURTWIG,
      Pkm.GROTLE,
      Pkm.TORTERRA
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.GRASS
  },
  PURITY_FOREST_80F_99F: {
    id: "PURITY_FOREST_80F_99F",
    name: "Purity Forest",
    pokemons: [
      Pkm.CELEBI,
      Pkm.DARKRAI,
      Pkm.BULBASAUR,
      Pkm.IVYSAUR,
      Pkm.VENUSAUR,
      Pkm.METAPOD,
      Pkm.RATTATA,
      Pkm.RATICATE,
      Pkm.SPEAROW,
      Pkm.NIDORANF,
      Pkm.NIDORANM,
      Pkm.VILEPLUME,
      Pkm.BELLSPROUT,
      Pkm.WEEPINBELL,
      Pkm.VICTREEBEL,
      Pkm.SCYTHER,
      Pkm.CHIKORITA,
      Pkm.BAYLEEF,
      Pkm.MEGANIUM,
      Pkm.TREECKO,
      Pkm.GROVYLE,
      Pkm.SCEPTILE,
      Pkm.SEEDOT,
      Pkm.NUZLEAF,
      Pkm.ROSELIA,
      Pkm.FLYGON,
      Pkm.MUNCHLAX,
      Pkm.TURTWIG,
      Pkm.GROTLE,
      Pkm.TORTERRA
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GRASS
  },
  RESCUE_TEAM_MAZE: {
    id: "RESCUE_TEAM_MAZE",
    name: "Rescue Team Maze",
    pokemons: [Pkm.PIDGEY, Pkm.RATTATA],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.NORMAL
  },
  ROCK_PATH: {
    id: "ROCK_PATH",
    name: "Rock Path",
    pokemons: [Pkm.PIDGEOT, Pkm.NIDORINA, Pkm.NIDORINO, Pkm.ZUBAT, Pkm.NUMEL],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.POISON
  },
  SILENT_CHASM: {
    id: "SILENT_CHASM",
    name: "Silent Chasm",
    pokemons: [
      Pkm.WEEDLE,
      Pkm.GLOOM,
      Pkm.HOUNDOUR,
      Pkm.POLIWAG,
      Pkm.TRAPINCH,
      Pkm.BEEDRILL
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.BUG
  },
  SILVER_TRENCH: {
    id: "SILVER_TRENCH",
    name: "Silver Trench",
    pokemons: [
      Pkm.LUGIA,
      Pkm.KABUTO,
      Pkm.AZUMARILL,
      Pkm.SLOWPOKE,
      Pkm.SPEAROW,
      Pkm.SEEDOT,
      Pkm.GOLBAT,
      Pkm.HOUNDOUR,
      Pkm.MAGNETON,
      Pkm.BEEDRILL,
      Pkm.FERALIGATR,
      Pkm.MAGMAR
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.WATER
    ],
    type: Synergy.WATER
  },
  SINISTER_WOODS: {
    id: "SINISTER_WOODS",
    name: "Sinister Woods",
    pokemons: [
      Pkm.SWINUB,
      Pkm.ODDISH,
      Pkm.SCYTHER,
      Pkm.SLAKOTH,
      Pkm.GENGAR,
      Pkm.MEDICHAM
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.WATER
    ],
    type: Synergy.BUG
  },
  SKY_TOWER: {
    id: "SKY_TOWER",
    name: "Sky Tower",
    pokemons: [
      Pkm.SHEDNINJA,
      Pkm.SHUPPET,
      Pkm.RAYQUAZA,
      Pkm.DUSKULL,
      Pkm.ALTARIA,
      Pkm.SCIZOR,
      Pkm.DUSCLOPS,
      Pkm.FLYGON
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.WATER
    ],
    type: Synergy.FLYING
  },
  SNOW_PATH: {
    id: "SNOW_PATH",
    name: "Snow Path",
    pokemons: [Pkm.AZURILL],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.WATER
    ],
    type: Synergy.ICE
  },
  SOLAR_CAVE: {
    id: "SOLAR_CAVE",
    name: "Solar Cave",
    pokemons: [
      Pkm.BELDUM,
      Pkm.ABRA,
      Pkm.MEDITITE,
      Pkm.METANG,
      Pkm.KIRLIA,
      Pkm.KADABRA,
      Pkm.MEDICHAM
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.PSYCHIC
  },
  SOUTHERN_CAVERN_01F_23F: {
    id: "SOUTHERN_CAVERN_01F_23F",
    name: "Southern Cavern",
    pokemons: [
      Pkm.GEODUDE,
      Pkm.SEEDOT,
      Pkm.CUBONE,
      Pkm.NIDOKING,
      Pkm.VIBRAVA,
      Pkm.LARVITAR,
      Pkm.MAROWAK,
      Pkm.GRAVELER,
      Pkm.RHYHORN,
      Pkm.FLYGON,
      Pkm.GOLEM,
      Pkm.ONIX,
      Pkm.RHYDON
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.GROUND
  },
  SOUTHERN_CAVERN_24F_50F: {
    id: "SOUTHERN_CAVERN_24F_50F",
    name: "Southern Cavern",
    pokemons: [
      Pkm.GEODUDE,
      Pkm.SEEDOT,
      Pkm.CUBONE,
      Pkm.NIDOKING,
      Pkm.VIBRAVA,
      Pkm.LARVITAR,
      Pkm.MAROWAK,
      Pkm.GRAVELER,
      Pkm.RHYHORN,
      Pkm.FLYGON,
      Pkm.GOLEM,
      Pkm.ONIX,
      Pkm.RHYDON
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.GROUND
  },
  STORMY_SEA_01F_16F: {
    id: "STORMY_SEA_01F_16F",
    name: "Stormy Sea",
    pokemons: [
      Pkm.OMANYTE,
      Pkm.OMASTAR,
      Pkm.SLOWPOKE,
      Pkm.SPHEAL,
      Pkm.OMASTAR,
      Pkm.KABUTOPS,
      Pkm.ARMALDO,
      Pkm.SEADRA,
      Pkm.SEALEO,
      Pkm.KYOGRE,
      Pkm.CARVANHA
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.WATER
    ],
    type: Synergy.WATER
  },
  STORMY_SEA_16F_39F: {
    id: "STORMY_SEA_16F_39F",
    name: "Stormy Sea",
    pokemons: [
      Pkm.OMANYTE,
      Pkm.OMASTAR,
      Pkm.SLOWPOKE,
      Pkm.SPHEAL,
      Pkm.OMASTAR,
      Pkm.KABUTOPS,
      Pkm.ARMALDO,
      Pkm.SEADRA,
      Pkm.SEALEO,
      Pkm.KYOGRE,
      Pkm.CARVANHA
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.WATER
    ],
    type: Synergy.WATER
  },
  THUNDERWAVE_CAVE: {
    id: "THUNDERWAVE_CAVE",
    name: "Thunderwave Cave",
    pokemons: [Pkm.RATTATA, Pkm.NIDORANM, Pkm.ELEKID],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.ELECTRIC
  },
  TINY_WOODS: {
    id: "TINY_WOODS",
    name: "Tiny Woods",
    pokemons: [Pkm.RATTATA, Pkm.RATTATA],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.WATER
    ],
    type: Synergy.NORMAL
  },
  UPROAR_FOREST: {
    id: "UPROAR_FOREST",
    name: "Uproar Forest",
    pokemons: [Pkm.ROSELIA, Pkm.NUZLEAF, Pkm.LOTAD, Pkm.RATICATE],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.WATER
    ],
    type: Synergy.GRASS
  },
  SERENITY_RIVER: {
    id: "SERENITY_RIVER",
    name: "Serenity River",
    pokemons: [Pkm.POLIWAG, Pkm.LOTAD],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.WATER
  },
  WATERFALL_POND: {
    id: "WATERFALL_POND",
    name: "Waterfall Pond",
    pokemons: [
      Pkm.MUDKIP,
      Pkm.LOTAD,
      Pkm.POLIWAG,
      Pkm.TOTODILE,
      Pkm.MAGIKARP,
      Pkm.SQUIRTLE,
      Pkm.LOMBRE,
      Pkm.MARSHTOMP
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.WATER
  },
  WESTERN_CAVE_B01F_B27F: {
    id: "WESTERN_CAVE_B01F_B27F",
    name: "Western Cave",
    pokemons: [
      Pkm.BUTTERFREE,
      Pkm.MEOWTH,
      Pkm.BELLOSSOM,
      Pkm.IGGLYBUFF,
      Pkm.ESPEON,
      Pkm.IVYSAUR,
      Pkm.AGGRON,
      Pkm.PERSIAN,
      Pkm.BAYLEEF,
      Pkm.ALAKAZAM,
      Pkm.TYRANITAR,
      Pkm.SCEPTILE,
      Pkm.ARCANINE,
      Pkm.SWAMPERT,
      Pkm.MACHAMP,
      Pkm.STEELIX,
      Pkm.CHARIZARD,
      Pkm.BLASTOISE,
      Pkm.MEWTWO
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.PSYCHIC
  },
  WESTERN_CAVE_B28F_B39F: {
    id: "WESTERN_CAVE_B28F_B39F",
    name: "Western Cave",
    pokemons: [
      Pkm.BUTTERFREE,
      Pkm.MEOWTH,
      Pkm.BELLOSSOM,
      Pkm.IGGLYBUFF,
      Pkm.ESPEON,
      Pkm.IVYSAUR,
      Pkm.AGGRON,
      Pkm.PERSIAN,
      Pkm.BAYLEEF,
      Pkm.ALAKAZAM,
      Pkm.TYRANITAR,
      Pkm.SCEPTILE,
      Pkm.ARCANINE,
      Pkm.SWAMPERT,
      Pkm.MACHAMP,
      Pkm.STEELIX,
      Pkm.CHARIZARD,
      Pkm.BLASTOISE,
      Pkm.MEWTWO
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.PSYCHIC
  },
  WISH_CAVE_01F_13F: {
    id: "WISH_CAVE_01F_13F",
    name: "Wish Cave",
    pokemons: [
      Pkm.BUTTERFREE,
      Pkm.MEOWTH,
      Pkm.BELLOSSOM,
      Pkm.IGGLYBUFF,
      Pkm.ESPEON,
      Pkm.IVYSAUR,
      Pkm.AGGRON,
      Pkm.PERSIAN,
      Pkm.BAYLEEF,
      Pkm.ALAKAZAM,
      Pkm.TYRANITAR,
      Pkm.SCEPTILE,
      Pkm.ARCANINE,
      Pkm.SWAMPERT,
      Pkm.MACHAMP,
      Pkm.STEELIX,
      Pkm.CHARIZARD,
      Pkm.BLASTOISE,
      Pkm.JIRACHI
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.GROUND_ALT_3,
      Header.WATER
    ],
    type: Synergy.PSYCHIC
  },
  WISH_CAVE_90F_99F: {
    id: "WISH_CAVE_90F_99F",
    name: "Wish Cave",
    pokemons: [
      Pkm.BUTTERFREE,
      Pkm.MEOWTH,
      Pkm.BELLOSSOM,
      Pkm.IGGLYBUFF,
      Pkm.ESPEON,
      Pkm.IVYSAUR,
      Pkm.AGGRON,
      Pkm.PERSIAN,
      Pkm.BAYLEEF,
      Pkm.ALAKAZAM,
      Pkm.TYRANITAR,
      Pkm.SCEPTILE,
      Pkm.ARCANINE,
      Pkm.SWAMPERT,
      Pkm.MACHAMP,
      Pkm.STEELIX,
      Pkm.CHARIZARD,
      Pkm.BLASTOISE,
      Pkm.JIRACHI
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.PSYCHIC
  },
  WYVERN_HILL: {
    id: "WYVERN_HILL",
    name: "Wyvern Hill",
    pokemons: [
      Pkm.BAGON,
      Pkm.DRATINI,
      Pkm.ALTARIA,
      Pkm.TOTODILE,
      Pkm.LUDICOLO,
      Pkm.SHELGON,
      Pkm.VIBRAVA,
      Pkm.DRAGONAIR,
      Pkm.SALAMENCE,
      Pkm.FLYGON,
      Pkm.DRAGONITE
    ],
    tileset: [
      Header.WALL,
      Header.WALL_ALT_1,
      Header.WALL_ALT_2,
      Header.GROUND,
      Header.GROUND_ALT_1,
      Header.GROUND_ALT_2,
      Header.WATER
    ],
    type: Synergy.DRAGON
  }
})
