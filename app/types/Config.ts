import { Emotion } from "."
import { DungeonMusic, DungeonPMDO } from "./enum/Dungeon"
import { AttackType, Rarity, Stat } from "./enum/Game"
import { Item } from "./enum/Item"
import { Pkm, PkmDuo, PkmProposition } from "./enum/Pokemon"
import { Synergy } from "./enum/Synergy"
import { Weather } from "./enum/Weather"

export const ON_ATTACK_MANA = 5
export const MANA_SCARF_MANA = 8
export const DELTA_ORB_MANA = 4
export const SCOPE_LENS_MANA = 15

export const BOARD_WIDTH = 8
export const BOARD_HEIGHT = 6

export const RarityHpCost: { [key in Rarity]: number } = Object.freeze({
  [Rarity.COMMON]: 1,
  [Rarity.UNCOMMON]: 1,
  [Rarity.RARE]: 2,
  [Rarity.EPIC]: 2,
  [Rarity.ULTRA]: 3,
  [Rarity.UNIQUE]: 3,
  [Rarity.LEGENDARY]: 3,
  [Rarity.SPECIAL]: 1,
  [Rarity.HATCH]: 4
})

// used to evaluate unit value, even if some categories are not found in shop
export const RarityCost: { [key in Rarity]: number } = Object.freeze({
  [Rarity.SPECIAL]: 0, // many edgecases with custom buy/sell prices
  [Rarity.COMMON]: 1,
  [Rarity.UNCOMMON]: 2,
  [Rarity.RARE]: 3,
  [Rarity.EPIC]: 4,
  [Rarity.ULTRA]: 5,
  [Rarity.UNIQUE]: 6,
  [Rarity.LEGENDARY]: 7,
  [Rarity.HATCH]: 11
})

export const EmotionCost: { [key in Emotion]: number } = {
  [Emotion.NORMAL]: 50,
  [Emotion.HAPPY]: 100,
  [Emotion.PAIN]: 100,
  [Emotion.ANGRY]: 100,
  [Emotion.WORRIED]: 100,
  [Emotion.SAD]: 100,
  [Emotion.CRYING]: 100,
  [Emotion.SHOUTING]: 150,
  [Emotion.TEARY_EYED]: 150,
  [Emotion.DETERMINED]: 150,
  [Emotion.JOYOUS]: 150,
  [Emotion.INSPIRED]: 150,
  [Emotion.SURPRISED]: 150,
  [Emotion.DIZZY]: 150,
  [Emotion.SPECIAL0]: 200,
  [Emotion.SPECIAL1]: 200,
  [Emotion.SIGH]: 200,
  [Emotion.STUNNED]: 200,
  [Emotion.SPECIAL2]: 200,
  [Emotion.SPECIAL3]: 200
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

export const SynergyTriggers: { [key in Synergy]: number[] } = {
  [Synergy.NORMAL]: [3, 5, 7, 9],
  [Synergy.GRASS]: [3, 5, 7],
  [Synergy.FIRE]: [2, 4, 6, 8],
  [Synergy.WATER]: [3, 6, 9],
  [Synergy.ELECTRIC]: [3, 6],
  [Synergy.FIGHTING]: [2, 4, 6, 8],
  [Synergy.PSYCHIC]: [2, 4, 6],
  [Synergy.DARK]: [3, 5, 7],
  [Synergy.STEEL]: [2, 4, 6, 8],
  [Synergy.GROUND]: [2, 4, 6, 8],
  [Synergy.POISON]: [3, 5, 7],
  [Synergy.DRAGON]: [3, 5, 7],
  [Synergy.FIELD]: [3, 6, 9],
  [Synergy.MONSTER]: [2, 4, 6],
  [Synergy.HUMAN]: [2, 4, 6],
  [Synergy.AQUATIC]: [2, 4, 6],
  [Synergy.BUG]: [2, 4, 6, 8],
  [Synergy.FLYING]: [2, 4, 6, 8],
  [Synergy.FLORA]: [3, 4, 5, 6],
  [Synergy.ROCK]: [2, 4, 6],
  [Synergy.GHOST]: [2, 4, 6, 8],
  [Synergy.FAIRY]: [2, 4, 6, 8],
  [Synergy.ICE]: [2, 4, 6, 8],
  [Synergy.FOSSIL]: [2, 4, 6],
  [Synergy.SOUND]: [2, 4, 6],
  [Synergy.ARTIFICIAL]: [2, 4, 6],
  [Synergy.BABY]: [3, 5, 7],
  [Synergy.LIGHT]: [2, 3, 4, 5],
  [Synergy.WILD]: [2, 4, 6, 9]
}

export const RequiredStageLevelForXpElligibility = 10

export const ExpPlace = [700, 500, 400, 300, 200, 150, 100, 0]

export const RarityColor: { [key in Rarity]: string } = {
  [Rarity.COMMON]: "#9f9f9f",
  [Rarity.UNCOMMON]: "#3bc95e",
  [Rarity.RARE]: "#41bfcc",
  [Rarity.EPIC]: "#ca6cee",
  [Rarity.ULTRA]: "#E53B3B",
  [Rarity.UNIQUE]: "#ffffff",
  [Rarity.LEGENDARY]: "#e6cb49",
  [Rarity.SPECIAL]: "#967FFF",
  [Rarity.HATCH]: "#b9915a"
}

export const BoosterRarityProbability: { [key in Rarity]: number } = {
  [Rarity.COMMON]: 0.12,
  [Rarity.UNCOMMON]: 0.2,
  [Rarity.RARE]: 0.2,
  [Rarity.EPIC]: 0.15,
  [Rarity.ULTRA]: 0.06,
  [Rarity.UNIQUE]: 0.08,
  [Rarity.LEGENDARY]: 0.05,
  [Rarity.HATCH]: 0.1,
  [Rarity.SPECIAL]: 0.03
}

export const DITTO_RATE = 0.005

export const AttackTypeColor: { [key in AttackType] } = {
  [AttackType.PHYSICAL]: "#FF6E55",
  [AttackType.SPECIAL]: "#7FC9FF",
  [AttackType.TRUE]: "#FFD800"
}

export const RarityProbabilityPerLevel: { [key: number]: number[] } = {
  1: [1, 0, 0, 0, 0],
  2: [1, 0, 0, 0, 0],
  3: [0.7, 0.3, 0, 0, 0],
  4: [0.55, 0.35, 0.1, 0, 0],
  5: [0.4, 0.38, 0.2, 0.02, 0],
  6: [0.25, 0.4, 0.3, 0.05, 0],
  7: [0.16, 0.33, 0.35, 0.15, 0.01],
  8: [0.11, 0.27, 0.35, 0.22, 0.05],
  9: [0.05, 0.2, 0.35, 0.3, 0.1]
}

export const EvolutionTime = {
  EGG_HATCH: 3,
  EVOLVE_HATCH: 5
}

export const KECLEON_SHOP_COST = 10

export const PoolSize: { [key in Rarity]: [number, number, number] } = {
  [Rarity.COMMON]: [1, 18, 29],
  [Rarity.UNCOMMON]: [1, 13, 22],
  [Rarity.RARE]: [1, 9, 18],
  [Rarity.EPIC]: [1, 7, 14],
  [Rarity.ULTRA]: [1, 5, 10],
  [Rarity.UNIQUE]: [1, 1, 1],
  [Rarity.LEGENDARY]: [1, 1, 1],
  [Rarity.SPECIAL]: [0, 0, 0],
  [Rarity.HATCH]: [0, 0, 0]
}

export const UniqueShop = new Array<PkmProposition>(
  Pkm.AERODACTYL,
  Pkm.BLACEPHALON,
  Pkm.REGIDRAGO,
  Pkm.REGIELEKI,
  Pkm.CASTFORM,
  Pkm.REGICE,
  Pkm.REGISTEEL,
  Pkm.REGIROCK,
  Pkm.UXIE,
  Pkm.MESPRIT,
  Pkm.AZELF,
  PkmDuo.LATIOS_LATIAS,
  Pkm.LAPRAS,
  Pkm.ABSOL,
  Pkm.SPIRITOMB,
  Pkm.ROTOM,
  Pkm.PHIONE,
  Pkm.COBALION,
  Pkm.KELDEO,
  Pkm.TAPU_KOKO,
  Pkm.TAPU_LELE,
  Pkm.SEVIPER,
  Pkm.KECLEON,
  Pkm.MAWILE,
  Pkm.TAUROS,
  Pkm.RELICANTH,
  Pkm.MEW,
  Pkm.CHATOT,
  Pkm.FARFETCH_D,
  Pkm.TAPU_BULU,
  Pkm.TAPU_FINI,
  Pkm.MIMIKYU,
  Pkm.TYROGUE,
  Pkm.VIRIZION,
  Pkm.ZERAORA,
  Pkm.SHUCKLE,
  Pkm.LUNATONE,
  Pkm.SOLROCK,
  Pkm.MILTANK,
  Pkm.MARACTUS,
  PkmDuo.PLUSLE_MINUN,
  Pkm.PINSIR,
  Pkm.GLIGAR,
  Pkm.DELIBIRD,
  Pkm.TORKOAL,
  Pkm.IRON_BUNDLE,
  Pkm.CHINGLING,
  Pkm.DHELMISE,
  Pkm.SPINDA,
  Pkm.HERACROSS,
  PkmDuo.ILLUMISE_VOLBEAT,
  Pkm.TANDEMAUS,
  Pkm.TROPIUS,
  Pkm.CARNIVINE,
  Pkm.HOOPA,
  Pkm.COMFEY,
  Pkm.SABLEYE,
  Pkm.DRACOVISH,
  Pkm.GIMMIGHOUL,
  Pkm.BRUXISH,
  Pkm.CYCLIZAR,
  Pkm.MINIOR,
  Pkm.MORPEKO,
  Pkm.TYPE_NULL,
  Pkm.KANGASKHAN,
  Pkm.DRUDDIGON,
  Pkm.COSMOG,
  Pkm.SCYTHER
)

export const LegendaryShop = new Array<PkmProposition>(
  Pkm.RESHIRAM,
  Pkm.ZEKROM,
  Pkm.STAKATAKA,
  Pkm.GENESECT,
  Pkm.GUZZLORD,
  Pkm.ETERNATUS,
  Pkm.MELOETTA,
  Pkm.MEWTWO,
  Pkm.ENTEI,
  Pkm.SUICUNE,
  Pkm.RAIKOU,
  Pkm.REGIGIGAS,
  Pkm.CELEBI,
  Pkm.VICTINI,
  Pkm.JIRACHI,
  Pkm.ARCEUS,
  Pkm.DEOXYS,
  Pkm.SHAYMIN,
  Pkm.GIRATINA,
  Pkm.DARKRAI,
  Pkm.CRESSELIA,
  Pkm.HEATRAN,
  Pkm.LUGIA,
  Pkm.HO_OH,
  Pkm.PALKIA,
  Pkm.DIALGA,
  Pkm.RAYQUAZA,
  Pkm.KYOGRE,
  Pkm.GROUDON,
  Pkm.VOLCANION,
  Pkm.MARSHADOW,
  Pkm.XERNEAS,
  Pkm.YVELTAL,
  Pkm.ZAPDOS,
  Pkm.MOLTRES,
  Pkm.ARTICUNO,
  Pkm.SPECTRIER,
  Pkm.KARTANA,
  Pkm.NECROZMA,
  Pkm.XURKITREE,
  Pkm.NIHILEGO,
  Pkm.PHEROMOSA,
  Pkm.TORNADUS,
  Pkm.THUNDURUS,
  Pkm.LANDORUS,
  Pkm.ENAMORUS,
  Pkm.MAGEARNA
)

export const HatchList = new Array<Pkm>(
  Pkm.GOTHITA,
  Pkm.DREEPY,
  Pkm.SNIVY,
  Pkm.SCORBUNNY,
  Pkm.POPPLIO,
  Pkm.ALOLAN_GEODUDE,
  Pkm.ROWLET,
  Pkm.FROAKIE,
  Pkm.TEPIG,
  Pkm.STARLY,
  Pkm.AXEW
)

export const NB_UNIQUE_PROPOSITIONS = 6
export const SHOP_SIZE = 6

export const FishRarityProbability: {
  [waterLevel: number]: { [key in Rarity]?: number }
} = {
  1: {
    [Rarity.SPECIAL]: 0.55,
    [Rarity.COMMON]: 0.35,
    [Rarity.UNCOMMON]: 0.1,
    [Rarity.RARE]: 0,
    [Rarity.EPIC]: 0
  },
  2: {
    [Rarity.SPECIAL]: 0.3,
    [Rarity.COMMON]: 0.35,
    [Rarity.UNCOMMON]: 0.25,
    [Rarity.RARE]: 0.1,
    [Rarity.EPIC]: 0
  },
  3: {
    [Rarity.SPECIAL]: 0,
    [Rarity.COMMON]: 0.4,
    [Rarity.UNCOMMON]: 0.3,
    [Rarity.RARE]: 0.2,
    [Rarity.EPIC]: 0.1
  }
}

export const MAX_PLAYERS_PER_GAME = 8

export const DEFAULT_ATK_SPEED = 0.75
export const DEFAULT_CRIT_CHANCE = 10
export const DEFAULT_CRIT_DAMAGE = 2

export const StageDuration: Record<number | "DEFAULT", number> = {
  1: 20,
  10: 45,
  20: 45,
  DEFAULT: 30
}
export const FIGHTING_PHASE_DURATION = 40000
export const ITEM_CAROUSEL_BASE_DURATION = 15000
export const PORTAL_CAROUSEL_BASE_DURATION = 20000

export const ItemCarouselStages = [4, 12, 17, 22, 27, 34]
export const ItemProposalStages = [3, 15]
export const AdditionalPicksStages = [5, 8, 11]
export const PortalCarouselStages = [10, 20]

export enum EloRank {
  BEGINNER = "BEGINNER",
  POKEBALL = "POKEBALL",
  GREATBALL = "GREATBALL",
  ULTRABALL = "ULTRABALL",
  MASTERBALL = "MASTERBALL"
}

export const EloRankThreshold: { [key in EloRank]: number } = {
  [EloRank.BEGINNER]: 0,
  [EloRank.POKEBALL]: 900,
  [EloRank.GREATBALL]: 1100,
  [EloRank.ULTRABALL]: 1250,
  [EloRank.MASTERBALL]: 1400
}

export const WeatherThreshold: { [weather in Weather]: number } = {
  [Weather.MISTY]: 8,
  [Weather.NEUTRAL]: 8,
  [Weather.NIGHT]: 8,
  [Weather.RAIN]: 8,
  [Weather.SANDSTORM]: 8,
  [Weather.SNOW]: 6,
  [Weather.STORM]: 6,
  [Weather.SUN]: 8,
  [Weather.WINDY]: 8
}

// 4  A  1
// D  X  B
// 3  C  2

export const MaskCoordinate: { [key in Mask]: { x: number; y: number } } =
  Object.freeze({
    X: { x: 4, y: 1 },
    A: { x: 4, y: 4 },
    B: { x: 3, y: 3 },
    C: { x: 4, y: 2 },
    D: { x: 5, y: 3 },
    AB: { x: 3, y: 2 },
    AC: { x: 3, y: 1 },
    AD: { x: 5, y: 1 },
    BC: { x: 3, y: 0 },
    BD: { x: 4, y: 0 },
    CD: { x: 5, y: 0 },
    ABC: { x: 5, y: 4 },
    ABD: { x: 2, y: 4 },
    ACD: { x: 3, y: 4 },
    BCD: { x: 2, y: 3 },
    ABCD: { x: 4, y: 3 },
    A1B: { x: 0, y: 2 },
    B2C: { x: 0, y: 0 },
    C3D: { x: 2, y: 0 },
    AD4: { x: 2, y: 2 },
    A1BC: { x: 2, y: 5 },
    AB2C: { x: 2, y: 6 },
    B2CD: { x: 5, y: 5 },
    BC3D: { x: 4, y: 5 },
    AC3D: { x: 3, y: 6 },
    ACD4: { x: 3, y: 5 },
    A1BD: { x: 5, y: 6 },
    ABD4: { x: 4, y: 6 },
    A1B2C: { x: 0, y: 1 },
    B2C3D: { x: 1, y: 0 },
    AC3D4: { x: 2, y: 1 },
    A1BD4: { x: 1, y: 2 },
    A1BCD: { x: 2, y: 7 },
    AB2CD: { x: 0, y: 7 },
    ABC3D: { x: 1, y: 7 },
    ABCD4: { x: 3, y: 7 },
    A1B2CD: { x: 1, y: 3 },
    AB2C3D: { x: 0, y: 4 },
    ABC3D4: { x: 0, y: 3 },
    A1BCD4: { x: 1, y: 4 },
    A1B2C3D: { x: 1, y: 6 },
    AB2C3D4: { x: 0, y: 6 },
    A1BC3D4: { x: 0, y: 5 },
    A1B2CD4: { x: 1, y: 5 },
    A1BC3D: { x: 4, y: 7 },
    AB2CD4: { x: 5, y: 7 },
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
  WALL,
  WATER,
  GROUND
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

export const ItemStats: Record<Item, { [stat in Stat]?: number }> = {
  [Item.FOSSIL_STONE]: {},
  [Item.TWISTED_SPOON]: { [Stat.AP]: 10 },
  [Item.MAGNET]: { [Stat.ATK_SPEED]: 10 },
  [Item.BLACK_GLASSES]: { [Stat.CRIT_CHANCE]: 10 },
  [Item.MIRACLE_SEED]: { [Stat.SHIELD]: 15 },
  [Item.CHARCOAL]: { [Stat.ATK]: 3 },
  [Item.NEVER_MELT_ICE]: { [Stat.SPE_DEF]: 2 },
  [Item.HEART_SCALE]: { [Stat.DEF]: 2 },
  [Item.MYSTIC_WATER]: { [Stat.PP]: 15 },
  [Item.OLD_AMBER]: {},
  [Item.DAWN_STONE]: { [Stat.AP]: 10 },
  [Item.WATER_STONE]: { [Stat.PP]: 15 },
  [Item.THUNDER_STONE]: { [Stat.ATK_SPEED]: 10 },
  [Item.FIRE_STONE]: { [Stat.ATK]: 3 },
  [Item.MOON_STONE]: { [Stat.DEF]: 2 },
  [Item.DUSK_STONE]: { [Stat.CRIT_CHANCE]: 10 },
  [Item.LEAF_STONE]: { [Stat.SHIELD]: 15 },
  [Item.ICE_STONE]: { [Stat.SPE_DEF]: 2 },
  [Item.CHOICE_SPECS]: { [Stat.AP]: 100 },
  [Item.SOUL_DEW]: { [Stat.AP]: 10, [Stat.PP]: 15 },
  [Item.UPGRADE]: { [Stat.AP]: 10, [Stat.ATK_SPEED]: 10 },
  [Item.REAPER_CLOTH]: { [Stat.AP]: 10, [Stat.CRIT_CHANCE]: 10 },
  [Item.POKEMONOMICON]: { [Stat.AP]: 10, [Stat.SHIELD]: 15 },
  [Item.POWER_LENS]: { [Stat.AP]: 10, [Stat.SPE_DEF]: 5 },
  [Item.SHELL_BELL]: { [Stat.AP]: 10, [Stat.ATK]: 3 },
  [Item.LUCKY_EGG]: { [Stat.AP]: 10, [Stat.DEF]: 2 },
  [Item.AQUA_EGG]: { [Stat.PP]: 50 },
  [Item.BLUE_ORB]: { [Stat.PP]: 15, [Stat.ATK_SPEED]: 10 },
  [Item.SCOPE_LENS]: { [Stat.PP]: 15, [Stat.CRIT_CHANCE]: 25 },
  [Item.STAR_DUST]: { [Stat.PP]: 15, [Stat.SHIELD]: 15 },
  [Item.DELTA_ORB]: { [Stat.PP]: 15, [Stat.SPE_DEF]: 2 },
  [Item.MANA_SCARF]: { [Stat.PP]: 15, [Stat.ATK]: 3 },
  [Item.SMOKE_BALL]: { [Stat.PP]: 15, [Stat.DEF]: 2 },
  [Item.XRAY_VISION]: { [Stat.ATK_SPEED]: 50 },
  [Item.RAZOR_FANG]: {
    [Stat.ATK_SPEED]: 10,
    [Stat.CRIT_CHANCE]: 10,
    [Stat.CRIT_DAMAGE]: 1
  },
  [Item.LEFTOVERS]: { [Stat.ATK_SPEED]: 10, [Stat.SHIELD]: 15 },
  [Item.CHOICE_SCARF]: { [Stat.ATK_SPEED]: 10, [Stat.SPE_DEF]: 2 },
  [Item.FIRE_GEM]: { [Stat.ATK_SPEED]: 10, [Stat.ATK]: 3 },
  [Item.DEFENSIVE_RIBBON]: { [Stat.ATK_SPEED]: 10, [Stat.DEF]: 2 },
  [Item.WONDER_BOX]: { [Stat.CRIT_CHANCE]: 10 },
  [Item.CLEANSE_TAG]: { [Stat.CRIT_CHANCE]: 10, [Stat.SHIELD]: 15 },
  [Item.WIDE_LENS]: { [Stat.CRIT_CHANCE]: 10, [Stat.SPE_DEF]: 2 },
  [Item.RAZOR_CLAW]: { [Stat.CRIT_CHANCE]: 50, [Stat.ATK]: 3 },
  [Item.FLUFFY_TAIL]: { [Stat.CRIT_CHANCE]: 10, [Stat.DEF]: 2 },
  [Item.KINGS_ROCK]: { [Stat.SHIELD]: 150 },
  [Item.SHINY_CHARM]: { [Stat.SHIELD]: 15, [Stat.SPE_DEF]: 2 },
  [Item.GRACIDEA_FLOWER]: { [Stat.SHIELD]: 15, [Stat.ATK]: 3 },
  [Item.FLAME_ORB]: { [Stat.SHIELD]: 15, [Stat.DEF]: 2 },
  [Item.ASSAULT_VEST]: { [Stat.SPE_DEF]: 20 },
  [Item.AMULET_COIN]: { [Stat.SPE_DEF]: 2, [Stat.ATK]: 3 },
  [Item.POKE_DOLL]: { [Stat.SPE_DEF]: 2, [Stat.DEF]: 2 },
  [Item.RED_ORB]: { [Stat.ATK]: 10 },
  [Item.MAX_REVIVE]: { [Stat.ATK]: 3, [Stat.DEF]: 2 },
  [Item.ROCKY_HELMET]: { [Stat.DEF]: 12 },
  [Item.AGUAV_BERRY]: {},
  [Item.APICOT_BERRY]: {},
  [Item.ASPEAR_BERRY]: {},
  [Item.BABIRI_BERRY]: {},
  [Item.CHERI_BERRY]: {},
  [Item.CHESTO_BERRY]: {},
  [Item.GANLON_BERRY]: {},
  [Item.JABOCA_BERRY]: {},
  [Item.LANSAT_BERRY]: {},
  [Item.LEPPA_BERRY]: {},
  [Item.LIECHI_BERRY]: {},
  [Item.LUM_BERRY]: {},
  [Item.ORAN_BERRY]: {},
  [Item.PECHA_BERRY]: {},
  [Item.PERSIM_BERRY]: {},
  [Item.PETAYA_BERRY]: {},
  [Item.RAWST_BERRY]: {},
  [Item.ROWAP_BERRY]: {},
  [Item.SALAC_BERRY]: {},
  [Item.SITRUS_BERRY]: {},
  [Item.COMFEY]: {},
  [Item.ELECTIRIZER]: { [Stat.ATK_SPEED]: 40 },
  [Item.MAGMARIZER]: { [Stat.ATK]: 8 },
  [Item.MACHO_BRACE]: { [Stat.ATK]: 15, [Stat.ATK_SPEED]: -25 },
  [Item.LIGHT_BALL]: { [Stat.AP]: 75 },
  [Item.TOXIC_ORB]: { [Stat.SHIELD]: 15, [Stat.SPE_DEF]: 2 },
  [Item.METRONOME]: { [Stat.PP]: 5 },
  [Item.METAL_COAT]: { [Stat.DEF]: 5 },
  [Item.SWIFT_WING]: { [Stat.ATK_SPEED]: 25 },
  [Item.HARD_STONE]: { [Stat.SHIELD]: 100 },
  [Item.BIG_NUGGET]: {
    [Stat.DEF]: 5,
    [Stat.SPE_DEF]: 5
  },
  [Item.INCENSE]: { [Stat.SPE_DEF]: 5 },
  [Item.EXP_SHARE]: {}
}

export const MusicByDungeon: Record<DungeonPMDO, DungeonMusic> = {
  [DungeonPMDO.AmpPlains]: DungeonMusic.AMP_PLAINS,
  [DungeonPMDO.AppleWoods]: DungeonMusic.APPLE_WOODS,
  [DungeonPMDO.BarrenValley]: DungeonMusic.BARREN_VALLEY,
  [DungeonPMDO.BeachCave]: DungeonMusic.BEACH_CAVE,
  [DungeonPMDO.BrineCave]: DungeonMusic.BRINE_CAVE,
  [DungeonPMDO.BuriedRelic1]: DungeonMusic.BURIED_RELIC,
  [DungeonPMDO.BuriedRelic2]: DungeonMusic.TIME_GEAR_REMIX,
  [DungeonPMDO.BuriedRelic3]: DungeonMusic.TIME_GEAR,
  [DungeonPMDO.ConcealedRuins]: DungeonMusic.CONCEALED_RUINS,
  [DungeonPMDO.CraggyCoast]: DungeonMusic.CRAGGY_COAST,
  [DungeonPMDO.CrystalCave1]: DungeonMusic.CRYSTAL_CAVE,
  [DungeonPMDO.CrystalCave2]: DungeonMusic.STAFF_ROLL,
  [DungeonPMDO.CrystalCrossing]: DungeonMusic.CRYSTAL_CROSSING,
  [DungeonPMDO.DarkCrater]: DungeonMusic.DARK_CRATER,
  [DungeonPMDO.DarkHill1]: DungeonMusic.DARK_HILL,
  [DungeonPMDO.DarkHill2]: DungeonMusic.I_SAW_SOMETHING_AGAIN,
  [DungeonPMDO.DarkIceMountain]: DungeonMusic.DARK_ICE_MOUNTAIN,
  [DungeonPMDO.DarkIceMountainPeak]: DungeonMusic.AT_THE_SNOWY_MOUNTAIN,
  [DungeonPMDO.DarkWasteland]: DungeonMusic.DARK_WASTELAND,
  [DungeonPMDO.DarknightRelic]: DungeonMusic.CHASM_CAVE,
  [DungeonPMDO.DeepBoulderQuarry]: DungeonMusic.BOULDER_QUARRY,
  [DungeonPMDO.DeepDarkCrater]: DungeonMusic.DEEP_DARK_CRATER,
  [DungeonPMDO.DeepDuskForest1]: DungeonMusic.DEEP_DUSK_FOREST,
  [DungeonPMDO.DeepDuskForest2]: DungeonMusic.GROWING_ANXIETY,
  [DungeonPMDO.DeepLimestoneCavern]: DungeonMusic.PROTECTED_WORLD_PEACE,
  [DungeonPMDO.DeepSealedRuin]: DungeonMusic.SEALED_RUIN_PIT,
  [DungeonPMDO.DesertRegion]: DungeonMusic.DUN_HONOO_2,
  [DungeonPMDO.DrenchedBluff]: DungeonMusic.DRENCHED_BLUFF,
  [DungeonPMDO.DuskForest1]: DungeonMusic.DUSK_FOREST,
  [DungeonPMDO.DuskForest2]: DungeonMusic.SINISTER_WOODS,
  [DungeonPMDO.ElectricMaze]: DungeonMusic.STOP_THIEF,
  [DungeonPMDO.FarAmpPlains]: DungeonMusic.FAR_AMP_PLAINS,
  [DungeonPMDO.FinalMaze2]: DungeonMusic.FRIEND_AREA_CAVES,
  [DungeonPMDO.FoggyForest]: DungeonMusic.FOGGY_FOREST,
  [DungeonPMDO.ForestPath]: DungeonMusic.SKY_PEAK_FOREST,
  [DungeonPMDO.FrostyForest]: DungeonMusic.FROSTY_FOREST,
  [DungeonPMDO.FutureTemporalSpire]: DungeonMusic.BATTLE_WITH_RAYQUAZA,
  [DungeonPMDO.FutureTemporalTower]: DungeonMusic.TEMPORAL_TOWER,
  [DungeonPMDO.GoldenChamber]: DungeonMusic.OUTLAW,
  [DungeonPMDO.GrassMaze]: DungeonMusic.MAKUHITA_DOJO,
  [DungeonPMDO.GreatCanyon]: DungeonMusic.GREAT_CANYON,
  [DungeonPMDO.HiddenHighland]: DungeonMusic.HIDDEN_HIGHLAND,
  [DungeonPMDO.HiddenLand]: DungeonMusic.HIDDEN_LAND,
  [DungeonPMDO.HowlingForest1]: DungeonMusic.RANDOM_DUNGEON_2,
  [DungeonPMDO.HowlingForest2]: DungeonMusic.FRIEND_AREA_FOREST,
  [DungeonPMDO.IceAegisCave]: DungeonMusic.ILLUSION_STONE_CHAMBER,
  [DungeonPMDO.IceMaze]: DungeonMusic.TOP_MENU_THEME,
  [DungeonPMDO.IcicleForest]: DungeonMusic.ICICLE_FOREST,
  [DungeonPMDO.JoyousTower]: DungeonMusic.A_NEW_WORLD,
  [DungeonPMDO.LapisCave]: DungeonMusic.LAPIS_CAVE,
  [DungeonPMDO.LightningField]: DungeonMusic.OH_NO,
  [DungeonPMDO.LimestoneCavern]: DungeonMusic.LIMESTONE_CAVERN,
  [DungeonPMDO.LowerBrineCave]: DungeonMusic.LOWER_BRINE_CAVE,
  [DungeonPMDO.LushPrairie]: DungeonMusic.WELCOME_TO_THE_WORLD_OF_POKEMON,
  [DungeonPMDO.MagmaCavern2]: DungeonMusic.MAGMA_CAVERN,
  [DungeonPMDO.MagmaCavern3]: DungeonMusic.MAGMA_CAVERN_PIT,
  [DungeonPMDO.MeteorCave]: DungeonMusic.RANDOM_DUNGEON_1,
  [DungeonPMDO.MiracleSea]: DungeonMusic.MIRACLE_SEA,
  [DungeonPMDO.MoonlitCourtyard]: DungeonMusic.GOODNIGHT,
  [DungeonPMDO.MtBlaze]: DungeonMusic.MT_BLAZE,
  [DungeonPMDO.MtBristle]: DungeonMusic.MT_BRISTLE,
  [DungeonPMDO.MtFaraway2]: DungeonMusic.FROSTY_GROTTO,
  [DungeonPMDO.MtFaraway4]: DungeonMusic.ESCAPE_THROUGH_THE_SNOW,
  [DungeonPMDO.MtFreeze]: DungeonMusic.MT_FREEZE,
  [DungeonPMDO.MtHorn]: DungeonMusic.MT_HORN,
  [DungeonPMDO.MtSteel1]: DungeonMusic.MT_STEEL,
  [DungeonPMDO.MtSteel2]: DungeonMusic.BOSS_BATTLE,
  [DungeonPMDO.MtThunder]: DungeonMusic.MT_THUNDER,
  [DungeonPMDO.MtThunderPeak]: DungeonMusic.MT_THUNDER_PEAK,
  [DungeonPMDO.MtTravail]: DungeonMusic.MT_TRAVAIL,
  [DungeonPMDO.MurkyCave]: DungeonMusic.MONSTER_HOUSE,
  [DungeonPMDO.MurkyForest]: DungeonMusic.MURKY_FOREST,
  [DungeonPMDO.MysteryJungle1]: DungeonMusic.FRIEND_AREA_STEPPE,
  [DungeonPMDO.MysteryJungle2]: DungeonMusic.BLIZZARD_ISLAND,
  [DungeonPMDO.MystifyingForest]: DungeonMusic.MYSTIFYING_FOREST,
  [DungeonPMDO.NorthernDesert1]: DungeonMusic.NORTHERN_DESERT,
  [DungeonPMDO.NorthernDesert2]: DungeonMusic.NORTHERN_DESERT,
  [DungeonPMDO.NorthernRange1]: DungeonMusic.FORTUNE_RAVINE,
  [DungeonPMDO.NorthernRange2]: DungeonMusic.TEAM_SKULL,
  [DungeonPMDO.NorthwindField]: DungeonMusic.THROUGH_THE_SEA_OF_TIME,
  [DungeonPMDO.PitfallValley1]: DungeonMusic.PERSONALITY_TEST,
  [DungeonPMDO.PoisonMaze]: DungeonMusic.RANDOM_DUNGEON_3,
  [DungeonPMDO.PurityForest2]: DungeonMusic.RUN_AWAY,
  [DungeonPMDO.PurityForest4]: DungeonMusic.POKEMON_SQUARE,
  [DungeonPMDO.PurityForest6]: DungeonMusic.SHAYMIN_VILLAGE,
  [DungeonPMDO.PurityForest7]: DungeonMusic.ON_THE_BEACH_AT_DUSK,
  [DungeonPMDO.QuicksandCave]: DungeonMusic.QUICKSAND_CAVE,
  [DungeonPMDO.QuicksandPit]: DungeonMusic.QUICKSAND_PIT,
  [DungeonPMDO.QuicksandUnused]: DungeonMusic.THERES_TROUBLE,
  [DungeonPMDO.RescueTeamMaze]: DungeonMusic.RESCUE_TEAM_BASE,
  [DungeonPMDO.RockAegisCave]: DungeonMusic.FRIEND_AREA_SWAMP,
  [DungeonPMDO.RockMaze]: DungeonMusic.DEFY_THE_LEGENDS,
  [DungeonPMDO.RockPathRB]: DungeonMusic.RISING_FEAR,
  [DungeonPMDO.RockPathTDS]: DungeonMusic.FRIEND_AREA_POND,
  [DungeonPMDO.SealedRuin]: DungeonMusic.THE_LEGEND_OF_NINETALES,
  [DungeonPMDO.SidePath]: DungeonMusic.CAVE_AND_SIDE_PATH,
  [DungeonPMDO.SilentChasm]: DungeonMusic.SILENT_CHASM,
  [DungeonPMDO.SkyPeak4thPass]: DungeonMusic.SKY_PEAK_COAST,
  [DungeonPMDO.SkyPeak7thPass]: DungeonMusic.SKY_PEAK_CAVE,
  [DungeonPMDO.SkyPeakSummitPass]: DungeonMusic.SKY_TOWER_SUMMIT,
  [DungeonPMDO.SkyTower]: DungeonMusic.SKY_TOWER,
  [DungeonPMDO.SnowPath]: DungeonMusic.SKY_PEAK_SNOWFIELD,
  [DungeonPMDO.SolarCave1]: DungeonMusic.SKY_PEAK_PRAIRIE,
  [DungeonPMDO.SouthernCavern1]: DungeonMusic.SPRING_CAVE,
  [DungeonPMDO.SouthernCavern2]: DungeonMusic.SPRING_CAVE_DEPTHS,
  [DungeonPMDO.SouthernJungle]: DungeonMusic.SOUTHERN_JUNGLE,
  [DungeonPMDO.SpacialCliffs]: DungeonMusic.SPACIAL_CLIFFS,
  [DungeonPMDO.SpacialRift1]: DungeonMusic.IN_THE_FUTURE,
  [DungeonPMDO.SpacialRift2]: DungeonMusic.PLANETS_PARALYSIS,
  [DungeonPMDO.SteamCave]: DungeonMusic.STEAM_CAVE,
  [DungeonPMDO.SteelAegisCave]: DungeonMusic.AEGIS_CAVE,
  [DungeonPMDO.StormySea1]: DungeonMusic.STORMY_SEA,
  [DungeonPMDO.StormySea2]: DungeonMusic.FRIEND_AREA_OCEANIC,
  [DungeonPMDO.SurroundedSea]: DungeonMusic.SURROUNDED_SEA,
  [DungeonPMDO.TemporalSpire]: DungeonMusic.TEMPORAL_SPIRE,
  [DungeonPMDO.TemporalTower]: DungeonMusic.GARDEVOIR_INSIDE_OF_A_DREAM,
  [DungeonPMDO.TemporalUnused]: DungeonMusic.TEMPORAL_PINNACLE,
  [DungeonPMDO.TestDungeon]: DungeonMusic.FRIEND_AREA_LAB,
  [DungeonPMDO.TheNightmare]: DungeonMusic.THE_POWER_OF_DARKNESS,
  [DungeonPMDO.ThunderwaveCave]: DungeonMusic.THUNDERWAVE_CAVE,
  [DungeonPMDO.TinyMeadow]: DungeonMusic.FRIEND_AREA_GRASSLANDS,
  [DungeonPMDO.TinyWoods]: DungeonMusic.TINY_WOODS,
  [DungeonPMDO.TreeshroudForest1]: DungeonMusic.TREESHROUD_FOREST,
  [DungeonPMDO.TreeshroudForest2]: DungeonMusic.FRIEND_AREA_WILDS,
  [DungeonPMDO.UnusedBrineCave]: DungeonMusic.IN_THE_NIGHTMARE,
  [DungeonPMDO.UnusedSteamCave]: DungeonMusic.UPPER_STEAM_CAVE,
  [DungeonPMDO.UnusedWaterfallPond]: DungeonMusic.DEEP_STAR_CAVE,
  [DungeonPMDO.UproarForest]: DungeonMusic.TREASURE_TOWN,
  [DungeonPMDO.VastIceMountain]: DungeonMusic.VAST_ICE_MOUNTAIN,
  [DungeonPMDO.VastIceMountainPeak]: DungeonMusic.VAST_ICE_MOUNTAIN_PEAK,
  [DungeonPMDO.WaterMaze]: DungeonMusic.MAROWAK_DOJO,
  [DungeonPMDO.WaterfallCave]: DungeonMusic.WATERFALL_CAVE,
  [DungeonPMDO.WaterfallPond]: DungeonMusic.STAR_CAVE,
  [DungeonPMDO.WesternCave1]: DungeonMusic.SKY_PEAK_FINAL_PASS,
  [DungeonPMDO.WesternCave2]: DungeonMusic.JOB_CLEAR,
  [DungeonPMDO.WishCave1]: DungeonMusic.LIVING_SPIRIT,
  [DungeonPMDO.WishCave2]: DungeonMusic.TEAM_CHARM_THEME,
  [DungeonPMDO.WorldAbyss2]: DungeonMusic.WORLD_CALAMITY,
  [DungeonPMDO.WyvernHill]: DungeonMusic.KECLEONS_SHOP,
  [DungeonPMDO.ZeroIsleEast3]: DungeonMusic.VERSUS_BOSS,
  [DungeonPMDO.ZeroIsleEast4]: DungeonMusic.VERSUS_LEGENDARY,
  [DungeonPMDO.ZeroIsleSouth1]: DungeonMusic.WIGGLYTUFFS_GUILD_REMIX,
  [DungeonPMDO.ZeroIsleSouth2]: DungeonMusic.WIGGLYTUFFS_GUILD
}

export type TilesetExchangeFile = {
  tileset_0: DtefTileset | undefined
  tileset_1: DtefTileset | undefined
  tileset_2: DtefTileset | undefined
}

export type DtefTileset = {
  static: StaticFrame
  animation: AnimatedFrame[]
}

export type StaticFrame = {
  firstgid: number
  name: string
  maskDefinition: MaskDefinition
}

export type MaskDefinition = {
  [TerrainType.GROUND]: Mask[]
  [TerrainType.WALL]: Mask[]
  [TerrainType.WATER]: Mask[]
}

export type AnimatedFrame = {
  frameDuration: number
  numberOfFrames: number
  name: string
  maskDefinition: MaskDefinition
  firstgid: number
}

export const DTEF_WIDTH = 144
export const DTEF_HEIGHT = 192
export const DTEF_TILESET_WIDTH = 6
export const DTEF_TILESET_HEIGHT = 8
export const DTEF_TILESET_TILE_WIDTH = 24

export const SCRIBBLE_LOBBY_CRON = "0 0 0-20/4 * * *" // every four hours from 00h to 20h
export const RANKED_LOBBY_CRON = "0 0 2-22/4 * * *" // every four hours from 2h to 22h

export const DUST_PER_BOOSTER = 50
export const DUST_PER_SHINY = 250
