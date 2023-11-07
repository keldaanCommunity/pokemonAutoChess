import { Synergy } from "./enum/Synergy"
import { Pkm, PkmDuo, PkmProposition } from "./enum/Pokemon"
import { Item } from "./enum/Item"
import { AttackType, Rarity, Stat } from "./enum/Game"
import { Emotion } from "."
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
  [Rarity.MYTHICAL]: 3,
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
  [Rarity.HATCH]: 4,
  [Rarity.ULTRA]: 5,
  [Rarity.UNIQUE]: 6,
  [Rarity.LEGENDARY]: 7,
  [Rarity.MYTHICAL]: 10
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

export const SynergyTriggers: { [key in Synergy]: number[] } = {
  [Synergy.NORMAL]: [3, 5, 7, 9],
  [Synergy.GRASS]: [3, 5, 7],
  [Synergy.FIRE]: [2, 4, 6, 8],
  [Synergy.WATER]: [3, 6, 9],
  [Synergy.ELECTRIC]: [3, 6],
  [Synergy.FIGHTING]: [2, 4, 6],
  [Synergy.PSYCHIC]: [2, 4, 6],
  [Synergy.DARK]: [3, 5, 7],
  [Synergy.STEEL]: [2, 4, 6],
  [Synergy.GROUND]: [2, 4, 6],
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
  [Synergy.ICE]: [2, 3, 4, 5, 6],
  [Synergy.FOSSIL]: [2, 4, 6],
  [Synergy.SOUND]: [2, 4, 6],
  [Synergy.ARTIFICIAL]: [2, 4, 6],
  [Synergy.BABY]: [3, 5],
  [Synergy.LIGHT]: [2, 3, 4, 5]
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
  [Rarity.MYTHICAL]: "#ffc0cb",
  [Rarity.SPECIAL]: "#967FFF",
  [Rarity.HATCH]: "#b9915a"
}

export const BoosterRarityProbability: { [key in Rarity]: number } = {
  [Rarity.COMMON]: 0.15,
  [Rarity.UNCOMMON]: 0.2,
  [Rarity.RARE]: 0.2,
  [Rarity.EPIC]: 0.15,
  [Rarity.ULTRA]: 0.06,
  [Rarity.UNIQUE]: 0.08,
  [Rarity.LEGENDARY]: 0.05,
  [Rarity.MYTHICAL]: 0.01,
  [Rarity.HATCH]: 0.1,
  [Rarity.SPECIAL]: 0
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
  5: [0.4, 0.3, 0.25, 0.05, 0],
  6: [0.29, 0.31, 0.295, 0.1, 0.005],
  7: [0.22, 0.28, 0.33, 0.15, 0.02],
  8: [0.16, 0.24, 0.33, 0.22, 0.05],
  9: [0.1, 0.19, 0.31, 0.3, 0.1]
}

export const EvolutionTime = {
  EGG_HATCH: 4,
  EVOLVE_HATCH: 4
}

export const TandemausEvolutionTurn = 14
export const MausholdEvolutionTurn = 20

export const PoolSize: { [key in Rarity]: [number, number, number] } = {
  [Rarity.COMMON]: [1, 18, 29],
  [Rarity.UNCOMMON]: [1, 13, 22],
  [Rarity.RARE]: [1, 9, 18],
  [Rarity.EPIC]: [1, 7, 14],
  [Rarity.ULTRA]: [1, 5, 10],
  [Rarity.UNIQUE]: [1, 1, 1],
  [Rarity.LEGENDARY]: [1, 1, 1],
  [Rarity.MYTHICAL]: [1, 1, 1],
  [Rarity.SPECIAL]: [0, 0, 0],
  [Rarity.HATCH]: [0, 0, 0]
}

export const CommonShop = new Array<Pkm>(
  Pkm.POLIWAG,
  Pkm.CHARMANDER,
  Pkm.GEODUDE,
  Pkm.AZURILL,
  Pkm.ZUBAT,
  Pkm.MAREEP,
  Pkm.CATERPIE,
  Pkm.WEEDLE,
  Pkm.PIDGEY,
  Pkm.HOPPIP,
  Pkm.SEEDOT,
  Pkm.SWINUB,
  Pkm.FENNEKIN,
  Pkm.PICHU,
  Pkm.SQUIRTLE,
  Pkm.ARON,
  Pkm.MUDKIP,
  Pkm.CHIMCHAR,
  Pkm.LITWICK
)

export const UncommonShop = new Array<Pkm>(
  Pkm.IGGLYBUFF,
  Pkm.CHIKORITA,
  Pkm.CYNDAQUIL,
  Pkm.TREECKO,
  Pkm.TORCHIC,
  Pkm.PIPLUP,
  Pkm.MACHOP,
  Pkm.HORSEA,
  Pkm.SPHEAL,
  Pkm.MAGNEMITE,
  Pkm.DUSKULL,
  Pkm.EEVEE,
  Pkm.FLABEBE,
  Pkm.HATENNA,
  Pkm.NIDORANF,
  Pkm.NIDORANM
)

export const RareShop = new Array<Pkm>(
  Pkm.BULBASAUR,
  Pkm.TURTWIG,
  Pkm.TRAPINCH,
  Pkm.RHYHORN,
  Pkm.TOGEPI,
  Pkm.LOTAD,
  Pkm.SHINX,
  Pkm.DRATINI,
  Pkm.MAGBY,
  Pkm.WHISMUR,
  Pkm.VANILLITE,
  Pkm.BAGON,
  Pkm.HONEDGE,
  Pkm.ABRA,
  Pkm.TOTODILE,
  Pkm.LARVITAR
)

export const EpicShop = new Array<Pkm>(
  Pkm.SLAKOTH,
  Pkm.RALTS,
  Pkm.BELDUM,
  Pkm.ELEKID,
  Pkm.SNORUNT,
  Pkm.BUDEW,
  Pkm.CUBONE,
  Pkm.HOUNDOUR,
  Pkm.GOOMY,
  Pkm.BOUNSWEET,
  Pkm.OSHAWOTT,
  Pkm.JANGMO_O,
  Pkm.WURMPLE,
  Pkm.TINKATINK,
  Pkm.GIBLE
)

export const UltraShop = new Array<Pkm>(
  Pkm.GASTLY,
  Pkm.ONIX,
  Pkm.SCYTHER,
  Pkm.RIOLU,
  Pkm.MEDITITE,
  Pkm.NUMEL,
  Pkm.SNOVER,
  Pkm.SWABLU,
  Pkm.BUNEARY,
  Pkm.ELECTRIKE,
  Pkm.SHUPPET,
  Pkm.HAPPINY,
  Pkm.SOLOSIS
)

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
  Pkm.TORNADUS,
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
  Pkm.TANDEMAUS
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
  Pkm.NIHILEGO
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
  Pkm.STARLY
)

export const NB_MYTHICAL_PROPOSITIONS = 6
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
    [Rarity.SPECIAL]: 0.1,
    [Rarity.COMMON]: 0.3,
    [Rarity.UNCOMMON]: 0.3,
    [Rarity.RARE]: 0.2,
    [Rarity.EPIC]: 0.1
  }
}

export const MAX_PLAYERS_PER_LOBBY = 8

export const DEFAULT_ATK_SPEED = 0.75
export const DEFAULT_CRIT_CHANCE = 10
export const DEFAULT_CRIT_DAMAGE = 2

export const StageDuration: Record<number | "DEFAULT", number> = {
  1: 20,
  10: 40,
  20: 40,
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

export const WeatherThreshold: { [weather in Weather]: number } = {
  [Weather.MISTY]: 8,
  [Weather.NEUTRAL]: 8,
  [Weather.NIGHT]: 8,
  [Weather.RAIN]: 8,
  [Weather.SANDSTORM]: 6,
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

export const ItemRecipe: { [key in Item]?: Item[] } = {
  [Item.OLD_AMBER]: [Item.FOSSIL_STONE, Item.FOSSIL_STONE],
  [Item.DAWN_STONE]: [Item.FOSSIL_STONE, Item.TWISTED_SPOON],
  [Item.WATER_STONE]: [Item.FOSSIL_STONE, Item.MYSTIC_WATER],
  [Item.THUNDER_STONE]: [Item.FOSSIL_STONE, Item.MAGNET],
  [Item.FIRE_STONE]: [Item.FOSSIL_STONE, Item.CHARCOAL],
  [Item.MOON_STONE]: [Item.FOSSIL_STONE, Item.HEART_SCALE],
  [Item.DUSK_STONE]: [Item.FOSSIL_STONE, Item.BLACK_GLASSES],
  [Item.LEAF_STONE]: [Item.FOSSIL_STONE, Item.MIRACLE_SEED],
  [Item.ICE_STONE]: [Item.FOSSIL_STONE, Item.NEVER_MELT_ICE],
  [Item.CHOICE_SPECS]: [Item.TWISTED_SPOON, Item.TWISTED_SPOON],
  [Item.SOUL_DEW]: [Item.TWISTED_SPOON, Item.MYSTIC_WATER],
  [Item.UPGRADE]: [Item.TWISTED_SPOON, Item.MAGNET],
  [Item.REAPER_CLOTH]: [Item.TWISTED_SPOON, Item.BLACK_GLASSES],
  [Item.POKEMONOMICON]: [Item.TWISTED_SPOON, Item.MIRACLE_SEED],
  [Item.POWER_LENS]: [Item.TWISTED_SPOON, Item.NEVER_MELT_ICE],
  [Item.SHELL_BELL]: [Item.TWISTED_SPOON, Item.CHARCOAL],
  [Item.LUCKY_EGG]: [Item.TWISTED_SPOON, Item.HEART_SCALE],
  [Item.AQUA_EGG]: [Item.MYSTIC_WATER, Item.MYSTIC_WATER],
  [Item.BLUE_ORB]: [Item.MYSTIC_WATER, Item.MAGNET],
  [Item.SCOPE_LENS]: [Item.MYSTIC_WATER, Item.BLACK_GLASSES],
  [Item.STAR_DUST]: [Item.MYSTIC_WATER, Item.MIRACLE_SEED],
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
  [Item.CLEANSE_TAG]: [Item.BLACK_GLASSES, Item.MIRACLE_SEED],
  [Item.WIDE_LENS]: [Item.BLACK_GLASSES, Item.NEVER_MELT_ICE],
  [Item.RAZOR_CLAW]: [Item.BLACK_GLASSES, Item.CHARCOAL],
  [Item.FLUFFY_TAIL]: [Item.BLACK_GLASSES, Item.HEART_SCALE],
  [Item.KINGS_ROCK]: [Item.MIRACLE_SEED, Item.MIRACLE_SEED],
  [Item.SHINY_CHARM]: [Item.MIRACLE_SEED, Item.NEVER_MELT_ICE],
  [Item.GRACIDEA_FLOWER]: [Item.MIRACLE_SEED, Item.CHARCOAL],
  [Item.FLAME_ORB]: [Item.MIRACLE_SEED, Item.HEART_SCALE],
  [Item.ASSAULT_VEST]: [Item.NEVER_MELT_ICE, Item.NEVER_MELT_ICE],
  [Item.AMULET_COIN]: [Item.NEVER_MELT_ICE, Item.CHARCOAL],
  [Item.POKE_DOLL]: [Item.NEVER_MELT_ICE, Item.HEART_SCALE],
  [Item.RED_ORB]: [Item.CHARCOAL, Item.CHARCOAL],
  [Item.MAX_REVIVE]: [Item.CHARCOAL, Item.HEART_SCALE],
  [Item.ROCKY_HELMET]: [Item.HEART_SCALE, Item.HEART_SCALE]
}

export const ItemStats: Record<Item, { [stat in Stat]?: number }> = {
  [Item.FOSSIL_STONE]: {},
  [Item.TWISTED_SPOON]: { [Stat.AP]: 10 },
  [Item.MAGNET]: { [Stat.ATK_SPEED]: 10 },
  [Item.BLACK_GLASSES]: { [Stat.CRIT_CHANCE]: 5 },
  [Item.MIRACLE_SEED]: { [Stat.SHIELD]: 15 },
  [Item.CHARCOAL]: { [Stat.ATK]: 1 },
  [Item.NEVER_MELT_ICE]: { [Stat.SPE_DEF]: 1 },
  [Item.HEART_SCALE]: { [Stat.DEF]: 1 },
  [Item.MYSTIC_WATER]: { [Stat.PP]: 15 },
  [Item.OLD_AMBER]: {},
  [Item.DAWN_STONE]: { [Stat.AP]: 10 },
  [Item.WATER_STONE]: { [Stat.PP]: 15 },
  [Item.THUNDER_STONE]: { [Stat.ATK_SPEED]: 10 },
  [Item.FIRE_STONE]: { [Stat.ATK]: 1 },
  [Item.MOON_STONE]: { [Stat.DEF]: 1 },
  [Item.DUSK_STONE]: { [Stat.CRIT_CHANCE]: 5 },
  [Item.LEAF_STONE]: { [Stat.SHIELD]: 15 },
  [Item.ICE_STONE]: { [Stat.SPE_DEF]: 1 },
  [Item.CHOICE_SPECS]: { [Stat.AP]: 100 },
  [Item.SOUL_DEW]: { [Stat.AP]: 10, [Stat.PP]: 15 },
  [Item.UPGRADE]: { [Stat.AP]: 10, [Stat.ATK_SPEED]: 10 },
  [Item.REAPER_CLOTH]: { [Stat.AP]: 20, [Stat.CRIT_CHANCE]: 20 },
  [Item.POKEMONOMICON]: { [Stat.AP]: 10, [Stat.SHIELD]: 15 },
  [Item.POWER_LENS]: { [Stat.AP]: 10, [Stat.SPE_DEF]: 5 },
  [Item.SHELL_BELL]: { [Stat.AP]: 10, [Stat.ATK]: 1 },
  [Item.LUCKY_EGG]: { [Stat.AP]: 10, [Stat.DEF]: 1 },
  [Item.AQUA_EGG]: { [Stat.PP]: 50 },
  [Item.BLUE_ORB]: { [Stat.PP]: 15, [Stat.ATK_SPEED]: 10 },
  [Item.SCOPE_LENS]: { [Stat.PP]: 15, [Stat.CRIT_CHANCE]: 25 },
  [Item.STAR_DUST]: { [Stat.PP]: 15, [Stat.SHIELD]: 15 },
  [Item.DELTA_ORB]: { [Stat.PP]: 15, [Stat.SPE_DEF]: 1 },
  [Item.MANA_SCARF]: { [Stat.PP]: 15, [Stat.ATK]: 1 },
  [Item.SMOKE_BALL]: { [Stat.PP]: 15, [Stat.DEF]: 1 },
  [Item.XRAY_VISION]: { [Stat.ATK_SPEED]: 50 },
  [Item.RAZOR_FANG]: {
    [Stat.ATK_SPEED]: 10,
    [Stat.CRIT_CHANCE]: 5,
    [Stat.CRIT_DAMAGE]: 1
  },
  [Item.LEFTOVERS]: { [Stat.ATK_SPEED]: 10, [Stat.SHIELD]: 15 },
  [Item.CHOICE_SCARF]: { [Stat.ATK_SPEED]: 10, [Stat.SPE_DEF]: 1 },
  [Item.FIRE_GEM]: { [Stat.ATK_SPEED]: 10, [Stat.ATK]: 1 },
  [Item.DEFENSIVE_RIBBON]: { [Stat.ATK_SPEED]: 10, [Stat.DEF]: 1 },
  [Item.WONDER_BOX]: { [Stat.CRIT_CHANCE]: 10 },
  [Item.CLEANSE_TAG]: { [Stat.CRIT_CHANCE]: 5, [Stat.SHIELD]: 15 },
  [Item.WIDE_LENS]: { [Stat.CRIT_CHANCE]: 5, [Stat.SPE_DEF]: 1 },
  [Item.RAZOR_CLAW]: { [Stat.CRIT_CHANCE]: 55, [Stat.ATK]: 1 },
  [Item.FLUFFY_TAIL]: { [Stat.CRIT_CHANCE]: 5, [Stat.DEF]: 5 },
  [Item.KINGS_ROCK]: { [Stat.SHIELD]: 150 },
  [Item.SHINY_CHARM]: { [Stat.SHIELD]: 15, [Stat.SPE_DEF]: 1 },
  [Item.GRACIDEA_FLOWER]: { [Stat.SHIELD]: 15, [Stat.ATK]: 1 },
  [Item.FLAME_ORB]: { [Stat.SHIELD]: 15, [Stat.DEF]: 1 },
  [Item.ASSAULT_VEST]: { [Stat.SPE_DEF]: 20 },
  [Item.AMULET_COIN]: { [Stat.SPE_DEF]: 1, [Stat.ATK]: 1 },
  [Item.POKE_DOLL]: { [Stat.SPE_DEF]: 1, [Stat.DEF]: 1 },
  [Item.RED_ORB]: { [Stat.ATK]: 10 },
  [Item.MAX_REVIVE]: { [Stat.ATK]: 1, [Stat.DEF]: 1 },
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
  [Item.SITRUS_BERRY]: {}
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

export enum DungeonPMDO {
  AmpPlains = "AmpPlains",
  AppleWoods = "AppleWoods",
  BarrenValley = "BarrenValley",
  BeachCave = "BeachCave",
  BrineCave = "BrineCave",
  BuriedRelic1 = "BuriedRelic1",
  BuriedRelic2 = "BuriedRelic2",
  BuriedRelic3 = "BuriedRelic3",
  ConcealedRuins = "ConcealedRuins",
  CraggyCoast = "CraggyCoast",
  CrystalCave1 = "CrystalCave1",
  CrystalCave2 = "CrystalCave2",
  CrystalCrossing = "CrystalCrossing",
  DarkCrater = "DarkCrater",
  DarkHill1 = "DarkHill1",
  DarkHill2 = "DarkHill2",
  DarkIceMountain = "DarkIceMountain",
  DarkIceMountainPeak = "DarkIceMountainPeak",
  DarknightRelic = "DarknightRelic",
  DarkWasteland = "DarkWasteland",
  DeepBoulderQuarry = "DeepBoulderQuarry",
  DeepDarkCrater = "DeepDarkCrater",
  DeepDuskForest1 = "DeepDuskForest1",
  DeepDuskForest2 = "DeepDuskForest2",
  DeepLimestoneCavern = "DeepLimestoneCavern",
  DeepSealedRuin = "DeepSealedRuin",
  DesertRegion = "DesertRegion",
  DrenchedBluff = "DrenchedBluff",
  DuskForest1 = "DuskForest1",
  DuskForest2 = "DuskForest2",
  ElectricMaze = "ElectricMaze",
  FarAmpPlains = "FarAmpPlains",
  FinalMaze2 = "FinalMaze2",
  FoggyForest = "FoggyForest",
  ForestPath = "ForestPath",
  FrostyForest = "FrostyForest",
  FutureTemporalSpire = "FutureTemporalSpire",
  FutureTemporalTower = "FutureTemporalTower",
  GoldenChamber = "GoldenChamber",
  GrassMaze = "GrassMaze",
  GreatCanyon = "GreatCanyon",
  HiddenHighland = "HiddenHighland",
  HiddenLand = "HiddenLand",
  HowlingForest1 = "HowlingForest1",
  HowlingForest2 = "HowlingForest2",
  IceAegisCave = "IceAegisCave",
  IceMaze = "IceMaze",
  IcicleForest = "IcicleForest",
  JoyousTower = "JoyousTower",
  LapisCave = "LapisCave",
  LightningField = "LightningField",
  LimestoneCavern = "LimestoneCavern",
  LowerBrineCave = "LowerBrineCave",
  LushPrairie = "LushPrairie",
  MagmaCavern2 = "MagmaCavern2",
  MagmaCavern3 = "MagmaCavern3",
  MeteorCave = "MeteorCave",
  MiracleSea = "MiracleSea",
  MoonlitCourtyard = "MoonlitCourtyard",
  MtBlaze = "MtBlaze",
  MtBristle = "MtBristle",
  MtFaraway2 = "MtFaraway2",
  MtFaraway4 = "MtFaraway4",
  MtFreeze = "MtFreeze",
  MtHorn = "MtHorn",
  MtSteel1 = "MtSteel1",
  MtSteel2 = "MtSteel2",
  MtThunder = "MtThunder",
  MtThunderPeak = "MtThunderPeak",
  MtTravail = "MtTravail",
  MurkyCave = "MurkyCave",
  MurkyForest = "MurkyForest",
  MysteryJungle1 = "MysteryJungle1",
  MysteryJungle2 = "MysteryJungle2",
  MystifyingForest = "MystifyingForest",
  NorthernDesert1 = "NorthernDesert1",
  NorthernDesert2 = "NorthernDesert2",
  NorthernRange1 = "NorthernRange1",
  NorthernRange2 = "NorthernRange2",
  NorthwindField = "NorthwindField",
  PitfallValley1 = "PitfallValley1",
  PoisonMaze = "PoisonMaze",
  PurityForest2 = "PurityForest2",
  PurityForest4 = "PurityForest4",
  PurityForest6 = "PurityForest6",
  PurityForest7 = "PurityForest7",
  QuicksandCave = "QuicksandCave",
  QuicksandPit = "QuicksandPit",
  QuicksandUnused = "QuicksandUnused",
  RescueTeamMaze = "RescueTeamMaze",
  RockAegisCave = "RockAegisCave",
  RockMaze = "RockMaze",
  RockPathRB = "RockPathRB",
  RockPathTDS = "RockPathTDS",
  SealedRuin = "SealedRuin",
  SidePath = "SidePath",
  SilentChasm = "SilentChasm",
  SkyPeak4thPass = "SkyPeak4thPass",
  SkyPeak7thPass = "SkyPeak7thPass",
  SkyPeakSummitPass = "SkyPeakSummitPass",
  SkyTower = "SkyTower",
  SnowPath = "SnowPath",
  SolarCave1 = "SolarCave1",
  SouthernCavern1 = "SouthernCavern1",
  SouthernCavern2 = "SouthernCavern2",
  SouthernJungle = "SouthernJungle",
  SpacialCliffs = "SpacialCliffs",
  SpacialRift1 = "SpacialRift1",
  SpacialRift2 = "SpacialRift2",
  SteamCave = "SteamCave",
  SteelAegisCave = "SteelAegisCave",
  StormySea1 = "StormySea1",
  StormySea2 = "StormySea2",
  SurroundedSea = "SurroundedSea",
  TemporalSpire = "TemporalSpire",
  TemporalTower = "TemporalTower",
  TemporalUnused = "TemporalUnused",
  TestDungeon = "TestDungeon",
  TheNightmare = "TheNightmare",
  ThunderwaveCave = "ThunderwaveCave",
  TinyMeadow = "TinyMeadow",
  TinyWoods = "TinyWoods",
  TreeshroudForest1 = "TreeshroudForest1",
  TreeshroudForest2 = "TreeshroudForest2",
  UnusedBrineCave = "UnusedBrineCave",
  UnusedSteamCave = "UnusedSteamCave",
  UnusedWaterfallPond = "UnusedWaterfallPond",
  UproarForest = "UproarForest",
  VastIceMountain = "VastIceMountain",
  VastIceMountainPeak = "VastIceMountainPeak",
  WaterfallCave = "WaterfallCave",
  WaterfallPond = "WaterfallPond",
  WaterMaze = "WaterMaze",
  WesternCave1 = "WesternCave1",
  WesternCave2 = "WesternCave2",
  WishCave1 = "WishCave1",
  WishCave2 = "WishCave2",
  WorldAbyss2 = "WorldAbyss2",
  WyvernHill = "WyvernHill",
  ZeroIsleEast3 = "ZeroIsleEast3",
  ZeroIsleEast4 = "ZeroIsleEast4",
  ZeroIsleSouth1 = "ZeroIsleSouth1",
  ZeroIsleSouth2 = "ZeroIsleSouth2"
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
