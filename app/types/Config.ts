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
  [Synergy.DARK]: [3, 6, 9],
  [Synergy.STEEL]: [2, 4],
  [Synergy.GROUND]: [2, 4, 6],
  [Synergy.POISON]: [3, 6],
  [Synergy.DRAGON]: [3, 5],
  [Synergy.FIELD]: [3, 6, 9],
  [Synergy.MONSTER]: [2, 4, 6],
  [Synergy.HUMAN]: [2, 4, 6],
  [Synergy.AQUATIC]: [2, 4, 6],
  [Synergy.BUG]: [2, 4, 6],
  [Synergy.FLYING]: [2, 4, 6, 8],
  [Synergy.FLORA]: [2, 3, 4, 5],
  [Synergy.ROCK]: [2, 4, 6],
  [Synergy.GHOST]: [2, 4, 6, 8],
  [Synergy.FAIRY]: [2, 4, 6],
  [Synergy.ICE]: [3, 5],
  [Synergy.FOSSIL]: [2, 4, 6],
  [Synergy.SOUND]: [2, 4, 6],
  [Synergy.ARTIFICIAL]: [2, 4, 6],
  [Synergy.BABY]: [3, 5]
}

export const RequiredStageLevelForXpElligibility = 10

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
  [Rarity.COMMON]: 0.15,
  [Rarity.NEUTRAL]: 0,
  [Rarity.UNCOMMON]: 0.2,
  [Rarity.RARE]: 0.2,
  [Rarity.EPIC]: 0.15,
  [Rarity.LEGENDARY]: 0.05,
  [Rarity.MYTHICAL]: 0.15,
  [Rarity.SUMMON]: 0,
  [Rarity.HATCH]: 0.1
}

export const DITTO_RATE = 0.005

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
  EGG_HATCH: 4,
  EVOLVE_HATCH: 4
}

export const PoolSize: { [key in Rarity]: [number, number, number] } = {
  [Rarity.COMMON]: [1, 14, 29],
  [Rarity.UNCOMMON]: [1, 11, 22],
  [Rarity.RARE]: [1, 9, 18],
  [Rarity.EPIC]: [1, 7, 14],
  [Rarity.LEGENDARY]: [1, 5, 10],
  [Rarity.MYTHICAL]: [1, 1, 1],
  [Rarity.NEUTRAL]: [0, 0, 0],
  [Rarity.SUMMON]: [0, 0, 0],
  [Rarity.HATCH]: [0, 0, 0]
}

export const CommonShop = new Array<Pkm>(
  Pkm.POLIWAG,
  Pkm.CHARMANDER,
  Pkm.GEODUDE,
  Pkm.AZURILL,
  Pkm.ZUBAT,
  Pkm.MAREEP,
  Pkm.CLEFFA,
  Pkm.CATERPIE,
  Pkm.WEEDLE,
  Pkm.PIDGEY,
  Pkm.HOPPIP,
  Pkm.SEEDOT,
  Pkm.STARLY,
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
  Pkm.TOTODILE,
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
  Pkm.BELLSPROUT,
  Pkm.SLOWPOKE,
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
  Pkm.ABRA
)

export const EpicShop = new Array<Pkm>(
  Pkm.LARVITAR,
  Pkm.SLAKOTH,
  Pkm.RALTS,
  Pkm.BELDUM,
  Pkm.GIBLE,
  Pkm.ELEKID,
  Pkm.SNORUNT,
  Pkm.BUDEW,
  Pkm.PORYGON,
  Pkm.CUBONE,
  Pkm.HOUNDOUR,
  Pkm.GOOMY,
  Pkm.BOUNSWEET,
  Pkm.OSHAWOTT,
  Pkm.JANGMO_O
)

export const LegendaryShop = new Array<Pkm>(
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
  Pkm.NINCADA,
  Pkm.HAPPINY,
  Pkm.SOLOSIS
)

export const Mythical1Shop = new Array<Pkm>(
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
  Pkm.LATIAS,
  Pkm.LATIOS,
  Pkm.ZAPDOS,
  Pkm.MOLTRES,
  Pkm.ARTICUNO,
  Pkm.LAPRAS,
  Pkm.ABSOL,
  Pkm.SPIRITOMB,
  Pkm.ROTOM,
  Pkm.PHIONE,
  Pkm.COBALION,
  Pkm.KELDEO,
  Pkm.VOLCARONA,
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
  Pkm.SHUCKLE
)

export const Mythical2Shop = new Array<Pkm>(
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
  Pkm.ORIGIN_GIRATINA,
  Pkm.MARSHADOW,
  Pkm.XERNEAS,
  Pkm.YVELTAL
)

export const MAX_PLAYERS_PER_LOBBY = 8

export const StageDuration: Record<number | "DEFAULT", number> = {
  0: 15,
  10: 50,
  20: 50,
  DEFAULT: 30
}

export const CarouselStages = [1, 6, 11, 16, 21, 26, 31, 36, 41]
export const ItemProposalStages = [2, 3]
export const AdditionalPicksStages = [5, 8]
export const MythicalPicksStages = [10, 20]

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
  }
]

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
  [Item.RUNE_PROTECT]: [Item.BLACK_GLASSES, Item.MIRACLE_SEED],
  [Item.WIDE_LENS]: [Item.BLACK_GLASSES, Item.NEVER_MELT_ICE],
  [Item.RAZOR_CLAW]: [Item.BLACK_GLASSES, Item.CHARCOAL],
  [Item.FLUFFY_TAIL]: [Item.BLACK_GLASSES, Item.HEART_SCALE],
  [Item.ORAN_BERRY]: [Item.MIRACLE_SEED, Item.MIRACLE_SEED],
  [Item.SHINY_CHARM]: [Item.MIRACLE_SEED, Item.NEVER_MELT_ICE],
  [Item.FOCUS_BAND]: [Item.MIRACLE_SEED, Item.CHARCOAL],
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
  [Item.MYSTIC_WATER]: { [Stat.MANA]: 15 },
  [Item.OLD_AMBER]: {},
  [Item.DAWN_STONE]: { [Stat.AP]: 10 },
  [Item.WATER_STONE]: { [Stat.MANA]: 15 },
  [Item.THUNDER_STONE]: { [Stat.ATK_SPEED]: 10 },
  [Item.FIRE_STONE]: { [Stat.ATK]: 1 },
  [Item.MOON_STONE]: { [Stat.DEF]: 1 },
  [Item.DUSK_STONE]: { [Stat.CRIT_CHANCE]: 5 },
  [Item.LEAF_STONE]: { [Stat.SHIELD]: 15 },
  [Item.ICY_ROCK]: { [Stat.SPE_DEF]: 1 },
  [Item.CHOICE_SPECS]: { [Stat.AP]: 100 },
  [Item.SOUL_DEW]: { [Stat.AP]: 10, [Stat.MANA]: 15 },
  [Item.UPGRADE]: { [Stat.AP]: 10, [Stat.ATK_SPEED]: 10 },
  [Item.REAPER_CLOTH]: { [Stat.AP]: 10, [Stat.CRIT_CHANCE]: 5 },
  [Item.POKEMONOMICON]: { [Stat.AP]: 10, [Stat.SHIELD]: 15 },
  [Item.POWER_LENS]: { [Stat.AP]: 10, [Stat.SPE_DEF]: 1 },
  [Item.SHELL_BELL]: { [Stat.AP]: 10, [Stat.ATK]: 1 },
  [Item.LUCKY_EGG]: { [Stat.AP]: 10, [Stat.DEF]: 1 },
  [Item.AQUA_EGG]: { [Stat.MANA]: 50 },
  [Item.BLUE_ORB]: { [Stat.MANA]: 15, [Stat.ATK_SPEED]: 10 },
  [Item.SCOPE_LENS]: { [Stat.MANA]: 15, [Stat.CRIT_CHANCE]: 25 },
  [Item.STAR_DUST]: { [Stat.MANA]: 15, [Stat.SHIELD]: 15 },
  [Item.DELTA_ORB]: { [Stat.MANA]: 15, [Stat.SPE_DEF]: 1 },
  [Item.MANA_SCARF]: { [Stat.MANA]: 15, [Stat.ATK]: 1 },
  [Item.SMOKE_BALL]: { [Stat.MANA]: 15, [Stat.DEF]: 1 },
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
  [Item.RUNE_PROTECT]: { [Stat.CRIT_CHANCE]: 5, [Stat.SHIELD]: 15 },
  [Item.WIDE_LENS]: { [Stat.CRIT_CHANCE]: 5, [Stat.SPE_DEF]: 1 },
  [Item.RAZOR_CLAW]: { [Stat.CRIT_CHANCE]: 55, [Stat.ATK]: 1 },
  [Item.FLUFFY_TAIL]: { [Stat.CRIT_CHANCE]: 5, [Stat.SPE_DEF]: 1 },
  [Item.ORAN_BERRY]: { [Stat.SHIELD]: 130 },
  [Item.SHINY_CHARM]: { [Stat.SHIELD]: 15, [Stat.SPE_DEF]: 1 },
  [Item.FOCUS_BAND]: { [Stat.SHIELD]: 15, [Stat.ATK]: 1 },
  [Item.FLAME_ORB]: { [Stat.SHIELD]: 15, [Stat.DEF]: 1 },
  [Item.ASSAULT_VEST]: { [Stat.SPE_DEF]: 18 },
  [Item.AMULET_COIN]: { [Stat.SPE_DEF]: 1, [Stat.ATK]: 1 },
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
    type: Synergy.STEEL
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
    type: Synergy.ROCK
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
    type: Synergy.STEEL
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
    type: Synergy.STEEL
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
    type: Synergy.STEEL
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

export enum AnimationType {
  Idle = "Idle",
  Walk = "Walk",
  Sleep = "Sleep",
  Hurt = "Hurt",
  Attack = "Attack",
  Charge = "Charge",
  Shoot = "Shoot",
  Strike = "Strike",
  Chop = "Chop",
  Scratch = "Scratch",
  Punch = "Punch",
  Slap = "Slap",
  Slice = "Slice",
  MultiScratch = "MultiScratch",
  MultiStrike = "MultiStrike",
  Uppercut = "Uppercut",
  Ricochet = "Ricochet",
  Bite = "Bite",
  Shake = "Shake",
  Jab = "Jab",
  Kick = "Kick",
  Lick = "Lick",
  Slam = "Slam",
  Stomp = "Stomp",
  Appeal = "Appeal",
  Dance = "Dance",
  Twirl = "Twirl",
  TailWhip = "TailWhip",
  Sing = "Sing",
  Sound = "Sound",
  Rumble = "Rumble",
  FlapAround = "FlapAround",
  Gas = "Gas",
  Shock = "Shock",
  Emit = "Emit",
  SpAttack = "SpAttack",
  Withdraw = "Withdraw",
  RearUp = "RearUp",
  Swell = "Swell",
  Swing = "Swing",
  Double = "Double",
  Rotate = "Rotate",
  Hop = "Hop",
  Hover = "Hover",
  QuickStrike = "QuickStrike",
  EventSleep = "EventSleep",
  Wake = "Wake",
  Eat = "Eat",
  Tumble = "Tumble",
  Pose = "Pose",
  Pull = "Pull",
  Pain = "Pain",
  Float = "Float",
  DeepBreath = "DeepBreath",
  Nod = "Nod",
  Sit = "Sit",
  LookUp = "LookUp",
  Sink = "Sink",
  Trip = "Trip",
  Laying = "Laying",
  LeapForth = "LeapForth",
  Head = "Head",
  Cringe = "Cringe",
  LostBalance = "LostBalance",
  TumbleBack = "TumbleBack",
  HitGround = "HitGround",
  Faint = "Faint",
  Fainted = "Fainted",
  StandingUp = "StandingUp",
  DigIn = "DigIn",
  DigOut = "DigOut",
  Wiggle = "Wiggle",
  Yawn = "Yawn",
  RaiseArms = "RaiseArms",
  CarefulWalk = "CarefulWalk",
  Injured = "Injured",
  Jump = "Jump",
  Roar = "Roar",
  Wave = "Wave",
  CRY = "Cry",
  Bow = "Bow",
  Special0 = "Special0",
  Special1 = "Special1",
  Special2 = "Special2",
  Special3 = "Special3",
  Special4 = "Special4",
  Special5 = "Special5",
  Special6 = "Special6",
  Special7 = "Special7",
  Special8 = "Special8",
  Special9 = "Special9",
  Special10 = "Special10",
  Special11 = "Special11",
  Special12 = "Special12",
  Special13 = "Special13",
  Special14 = "Special14",
  Special15 = "Special15",
  Special16 = "Special16",
  Special17 = "Special17",
  Special18 = "Special18",
  Special19 = "Special19",
  Special20 = "Special20",
  Special21 = "Special21",
  Special22 = "Special22",
  Special23 = "Special23",
  Special24 = "Special24",
  Special25 = "Special25",
  Special26 = "Special26",
  Special27 = "Special27",
  Special28 = "Special28",
  Special29 = "Special29",
  Special30 = "Special30",
  Special31 = "Special31"
}

export const PokemonAnimation: {
  [key in Pkm]: { attack: AnimationType; ability: AnimationType }
} = {
  [Pkm.EGG]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.DITTO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.BULBASAUR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate
  },
  [Pkm.IVYSAUR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate
  },
  [Pkm.VENUSAUR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate
  },
  [Pkm.CHARMANDER]: {
    attack: AnimationType.Kick,
    ability: AnimationType.DeepBreath
  },
  [Pkm.CHARMELEON]: {
    attack: AnimationType.Strike,
    ability: AnimationType.DeepBreath
  },
  [Pkm.CHARIZARD]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.SQUIRTLE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.DeepBreath
  },
  [Pkm.WARTORTLE]: {
    attack: AnimationType.Ricochet,
    ability: AnimationType.Shoot
  },
  [Pkm.BLASTOISE]: {
    attack: AnimationType.Ricochet,
    ability: AnimationType.Shoot
  },
  [Pkm.GEODUDE]: {
    attack: AnimationType.Punch,
    ability: AnimationType.Shoot
  },
  [Pkm.GRAVELER]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Shoot
  },
  [Pkm.GOLEM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.AZURILL]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Special0
  },
  [Pkm.MARILL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.AZUMARILL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.ZUBAT]: {
    attack: AnimationType.Eat,
    ability: AnimationType.Attack
  },
  [Pkm.GOLBAT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.CROBAT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.MAREEP]: {
    attack: AnimationType.Emit,
    ability: AnimationType.Attack
  },
  [Pkm.FLAFFY]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.AMPHAROS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.CLEFFA]: {
    attack: AnimationType.Dance,
    ability: AnimationType.Rotate
  },
  [Pkm.CLEFAIRY]: {
    attack: AnimationType.Dance,
    ability: AnimationType.Rotate
  },
  [Pkm.CLEFABLE]: {
    attack: AnimationType.Dance,
    ability: AnimationType.Rotate
  },
  [Pkm.IGGLYBUFF]: {
    attack: AnimationType.Special1,
    ability: AnimationType.EventSleep
  },
  [Pkm.WIGGLYTUFF]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Sleep
  },
  [Pkm.JIGGLYPUFF]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.CATERPIE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.METAPOD]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.BUTTERFREE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.WEEDLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Strike
  },
  [Pkm.KAKUNA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.BEEDRILL]: {
    attack: AnimationType.Jab,
    ability: AnimationType.Attack
  },
  [Pkm.PIDGEY]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.FlapAround
  },
  [Pkm.PIDGEOTTO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.FlapAround
  },
  [Pkm.PIDGEOT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.FlapAround
  },
  [Pkm.HOPPIP]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.SKIPLOOM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.JUMPLUFF]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.SEEDOT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.NUZLEAF]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.SHIFTRY]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Attack
  },
  [Pkm.STARLY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.STARAVIA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.STARAPTOR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.CHIKORITA]: {
    attack: AnimationType.DeepBreath,
    ability: AnimationType.Charge
  },
  [Pkm.BAYLEEF]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.MEGANIUM]: {
    attack: AnimationType.Shake,
    ability: AnimationType.Charge
  },
  [Pkm.CYNDAQUIL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.QUILAVA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Strike
  },
  [Pkm.TYPHLOSION]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.TOTODILE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.HitGround
  },
  [Pkm.CROCONAW]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.FERALIGATR]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.TREECKO]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Pose
  },
  [Pkm.GROVYLE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Special17
  },
  [Pkm.SCEPTILE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Strike
  },
  [Pkm.TORCHIC]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.COMBUSKEN]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack
  },
  [Pkm.BLAZIKEN]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Kick
  },
  [Pkm.MUDKIP]: {
    attack: AnimationType.Pose,
    ability: AnimationType.Twirl
  },
  [Pkm.MARSHTOMP]: {
    attack: AnimationType.Withdraw,
    ability: AnimationType.Swing
  },
  [Pkm.SWAMPERT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing
  },
  [Pkm.TURTWIG]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.GROTLE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.TORTERRA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.CHIMCHAR]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.DeepBreath
  },
  [Pkm.MONFERNO]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Shoot
  },
  [Pkm.INFERNAPE]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Shoot
  },
  [Pkm.PIPLUP]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing
  },
  [Pkm.PRINPLUP]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing
  },
  [Pkm.EMPOLEON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing
  },
  [Pkm.NIDORANF]: {
    attack: AnimationType.MultiScratch,
    ability: AnimationType.Shoot
  },
  [Pkm.NIDORINA]: {
    attack: AnimationType.MultiScratch,
    ability: AnimationType.Shoot
  },
  [Pkm.NIDOQUEEN]: {
    attack: AnimationType.MultiScratch,
    ability: AnimationType.Shoot
  },
  [Pkm.NIDORANM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Emit
  },
  [Pkm.NIDORINO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Emit
  },
  [Pkm.NIDOKING]: {
    attack: AnimationType.Strike,
    ability: AnimationType.RearUp
  },
  [Pkm.PICHU]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Shock
  },
  [Pkm.PIKACHU]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shock
  },
  [Pkm.RAICHU]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shock
  },
  [Pkm.MACHOP]: {
    attack: AnimationType.Kick,
    ability: AnimationType.Strike
  },
  [Pkm.MACHOKE]: {
    attack: AnimationType.Kick,
    ability: AnimationType.Punch
  },
  [Pkm.MACHAMP]: {
    attack: AnimationType.Kick,
    ability: AnimationType.Punch
  },
  [Pkm.HORSEA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.SEADRA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.KINGDRA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.TRAPINCH]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Swing
  },
  [Pkm.VIBRAVA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing
  },
  [Pkm.FLYGON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing
  },
  [Pkm.SPHEAL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.SEALEO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.WALREIN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.ARON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.LAIRON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.AGGRON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DigOut
  },
  [Pkm.MAGNEMITE]: {
    attack: AnimationType.SpAttack,
    ability: AnimationType.Double
  },
  [Pkm.MAGNETON]: {
    attack: AnimationType.SpAttack,
    ability: AnimationType.Double
  },
  [Pkm.MAGNEZONE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack
  },
  [Pkm.RHYHORN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Stomp
  },
  [Pkm.RHYDON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Stomp
  },
  [Pkm.RHYPERIOR]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Rumble
  },
  [Pkm.TOGEPI]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Dance
  },
  [Pkm.TOGETIC]: {
    attack: AnimationType.Hover,
    ability: AnimationType.Dance
  },
  [Pkm.TOGEKISS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hover
  },
  [Pkm.DUSKULL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack
  },
  [Pkm.DUSCLOPS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack
  },
  [Pkm.DUSKNOIR]: {
    attack: AnimationType.Emit,
    ability: AnimationType.Special3
  },
  [Pkm.LOTAD]: {
    attack: AnimationType.Shake,
    ability: AnimationType.Double
  },
  [Pkm.LOMBRE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Double
  },
  [Pkm.LUDICOLO]: {
    attack: AnimationType.Special0,
    ability: AnimationType.Double
  },
  [Pkm.SHINX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.LUXIO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.LUXRAY]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.POLIWAG]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate
  },
  [Pkm.POLIWHIRL]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Rotate
  },
  [Pkm.POLITOED]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Rotate
  },
  [Pkm.ABRA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.KADABRA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.ALAKAZAM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Special1
  },
  [Pkm.GASTLY]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Lick
  },
  [Pkm.HAUNTER]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.MultiStrike
  },
  [Pkm.GENGAR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Special2
  },
  [Pkm.DRATINI]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.DRAGONAIR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.DRAGONITE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Emit
  },
  [Pkm.LARVITAR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.PUPITAR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.TYRANITAR]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.SLAKOTH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Appeal
  },
  [Pkm.VIGOROTH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Dance
  },
  [Pkm.SLAKING]: {
    attack: AnimationType.Punch,
    ability: AnimationType.Dance
  },
  [Pkm.RALTS]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Pull
  },
  [Pkm.KIRLIA]: {
    attack: AnimationType.Twirl,
    ability: AnimationType.Pose
  },
  [Pkm.GARDEVOIR]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Special2
  },
  [Pkm.BAGON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Bite
  },
  [Pkm.SHELGON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.SALAMENCE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.BELDUM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing
  },
  [Pkm.METANG]: {
    attack: AnimationType.Attack,
    ability: AnimationType.MultiScratch
  },
  [Pkm.METAGROSS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Ricochet
  },
  [Pkm.GIBLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.GABITE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.GARCHOMP]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.ELEKID]: {
    attack: AnimationType.Punch,
    ability: AnimationType.Shock
  },
  [Pkm.ELECTABUZZ]: {
    attack: AnimationType.Punch,
    ability: AnimationType.Shoot
  },
  [Pkm.ELECTIVIRE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Emit
  },
  [Pkm.MAGBY]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.DeepBreath
  },
  [Pkm.MAGMAR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.MAGMORTAR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.MUNCHLAX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.DeepBreath
  },
  [Pkm.SNORLAX]: {
    attack: AnimationType.Stomp,
    ability: AnimationType.Charge
  },
  [Pkm.GROWLITHE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.ARCANINE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.ONIX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.STEELIX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.MEGA_STEELIX]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.SCYTHER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Slice
  },
  [Pkm.SCIZOR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.MultiScratch
  },
  [Pkm.MEGA_SCIZOR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.RIOLU]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Pose
  },
  [Pkm.LUCARIO]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Pose
  },
  [Pkm.MEGA_LUCARIO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.MAGIKARP]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.RATTATA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.RATICATE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.SPEAROW]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.FEAROW]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.GYARADOS]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Attack
  },
  [Pkm.LUGIA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hover
  },
  [Pkm.GIRATINA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack
  },
  [Pkm.ZAPDOS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Emit
  },
  [Pkm.MOLTRES]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Pose
  },
  [Pkm.ARTICUNO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.DIALGA]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Special0
  },
  [Pkm.PALKIA]: {
    attack: AnimationType.Special0,
    ability: AnimationType.RearUp
  },
  [Pkm.SUICUNE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Roar
  },
  [Pkm.RAIKOU]: {
    attack: AnimationType.Shock,
    ability: AnimationType.Roar
  },
  [Pkm.ENTEI]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Roar
  },
  [Pkm.REGICE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.REGIROCK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.REGISTEEL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.KYOGRE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swell
  },
  [Pkm.GROUDON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Emit
  },
  [Pkm.RAYQUAZA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.REGIGIGAS]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Special0
  },
  [Pkm.EEVEE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DeepBreath
  },
  [Pkm.VAPOREON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.JOLTEON]: {
    attack: AnimationType.Shock,
    ability: AnimationType.Pose
  },
  [Pkm.FLAREON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.ESPEON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.UMBREON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Eat
  },
  [Pkm.LEAFEON]: {
    attack: AnimationType.QuickStrike,
    ability: AnimationType.DeepBreath
  },
  [Pkm.SYLVEON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate
  },
  [Pkm.MEDITITE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack
  },
  [Pkm.MEDICHAM]: {
    attack: AnimationType.Charge,
    ability: AnimationType.SpAttack
  },
  [Pkm.MEGA_MEDICHAM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.NUMEL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.CAMERUPT]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.RearUp
  },
  [Pkm.MEGA_CAMERUPT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.DARKRAI]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Sink
  },
  [Pkm.LITWICK]: {
    attack: AnimationType.Sink,
    ability: AnimationType.Pose
  },
  [Pkm.LAMPENT]: {
    attack: AnimationType.Emit,
    ability: AnimationType.Rotate
  },
  [Pkm.CHANDELURE]: {
    attack: AnimationType.Emit,
    ability: AnimationType.Rotate
  },
  [Pkm.SLOWPOKE]: {
    attack: AnimationType.Charge,
    ability: AnimationType.Swing
  },
  [Pkm.SLOWBRO]: {
    attack: AnimationType.Charge,
    ability: AnimationType.Shake
  },
  [Pkm.SLOWKING]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing
  },
  [Pkm.BELLSPROUT]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Rotate
  },
  [Pkm.WEEPINBELL]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Rotate
  },
  [Pkm.VICTREEBEL]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Swing
  },
  [Pkm.SWINUB]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shake
  },
  [Pkm.PILOSWINE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.MAMOSWINE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Special0
  },
  [Pkm.SNORUNT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Strike
  },
  [Pkm.GLALIE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Bite
  },
  [Pkm.FROSLASS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.SNOVER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.ABOMASNOW]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.MEGA_ABOMASNOW]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.VANILLITE]: {
    attack: AnimationType.DeepBreath,
    ability: AnimationType.HitGround
  },
  [Pkm.VANILLISH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate
  },
  [Pkm.VANILLUXE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.GLACEON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Pose
  },
  [Pkm.VOLCARONA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.LANDORUS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.THUNDURUS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.TORNADUS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.KELDEO]: {
    attack: AnimationType.Swing,
    ability: AnimationType.RearUp
  },
  [Pkm.TERRAKION]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.VIRIZION]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.COBALION]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing
  },
  [Pkm.MANAPHY]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Double
  },
  [Pkm.ROTOM]: {
    attack: AnimationType.Emit,
    ability: AnimationType.Double
  },
  [Pkm.SPIRITOMB]: {
    attack: AnimationType.Withdraw,
    ability: AnimationType.Special1
  },
  [Pkm.ABSOL]: {
    attack: AnimationType.QuickStrike,
    ability: AnimationType.SpAttack
  },
  [Pkm.LAPRAS]: {
    attack: AnimationType.Swing,
    ability: AnimationType.RearUp
  },
  [Pkm.LATIAS]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Special2
  },
  [Pkm.LATIOS]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Special0
  },
  [Pkm.MESPRIT]: {
    attack: AnimationType.Hover,
    ability: AnimationType.DeepBreath
  },
  [Pkm.AZELF]: {
    attack: AnimationType.Hover,
    ability: AnimationType.Special1
  },
  [Pkm.UXIE]: {
    attack: AnimationType.Hover,
    ability: AnimationType.Attack
  },
  [Pkm.MEWTWO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Pose
  },
  [Pkm.KYUREM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.RESHIRAM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.ZEKROM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.CELEBI]: {
    attack: AnimationType.DeepBreath,
    ability: AnimationType.Special0
  },
  [Pkm.VICTINI]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.JIRACHI]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Pose
  },
  [Pkm.ARCEUS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Pose
  },
  [Pkm.DEOXYS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Emit
  },
  [Pkm.SHAYMIN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Emit
  },
  [Pkm.CRESSELIA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.HEATRAN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Emit
  },
  [Pkm.HO_OH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Jab
  },
  [Pkm.AERODACTYL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Strike
  },
  [Pkm.PRIMAL_KYOGRE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.PRIMAL_GROUDON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.MEOWTH]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Pose
  },
  [Pkm.PERSIAN]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.DEINO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.ZWEILOUS]: {
    attack: AnimationType.Jab,
    ability: AnimationType.Charge
  },
  [Pkm.HYDREIGON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.SANDILE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.KROKOROK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.KROOKODILE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.SOLOSIS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.DUOSION]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.REUNICLUS]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Shoot
  },
  [Pkm.MEGA_RAYQUAZA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.SWABLU]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.ODDISH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.GLOOM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.VILEPLUME]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.BELLOSSOM]: {
    attack: AnimationType.Special0,
    ability: AnimationType.Twirl
  },
  [Pkm.AMAURA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DeepBreath
  },
  [Pkm.AURORUS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.ANORITH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Scratch
  },
  [Pkm.ARMALDO]: {
    attack: AnimationType.Scratch,
    ability: AnimationType.Special0
  },
  [Pkm.ARCHEN]: {
    attack: AnimationType.Swing,
    ability: AnimationType.FlapAround
  },
  [Pkm.ARCHEOPS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Strike
  },
  [Pkm.SHIELDON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.BASTIODON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.TIRTOUGA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.CARRACOSTA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.LILEEP]: {
    attack: AnimationType.SpAttack,
    ability: AnimationType.Shoot
  },
  [Pkm.CRADILY]: {
    attack: AnimationType.SpAttack,
    ability: AnimationType.Shoot
  },
  [Pkm.CRANIDOS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.RAMPARDOS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.KABUTO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.KABUTOPS]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Charge
  },
  [Pkm.OMANYTE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Withdraw
  },
  [Pkm.OMASTAR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Withdraw
  },
  [Pkm.TYRUNT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.TYRANTRUM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.BUDEW]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing
  },
  [Pkm.ROSELIA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing
  },
  [Pkm.ROSERADE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing
  },
  [Pkm.BUNEARY]: {
    attack: AnimationType.QuickStrike,
    ability: AnimationType.Attack
  },
  [Pkm.LOPUNNY]: {
    attack: AnimationType.QuickStrike,
    ability: AnimationType.Attack
  },
  [Pkm.MEGA_LOPUNNY]: {
    attack: AnimationType.QuickStrike,
    ability: AnimationType.Attack
  },
  [Pkm.AXEW]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Emit
  },
  [Pkm.FRAXURE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.HAXORUS]: {
    attack: AnimationType.Slice,
    ability: AnimationType.Charge
  },
  [Pkm.VENIPEDE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.WHIRLIPEDE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.SCOLIPEDE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.PORYGON]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Charge
  },
  [Pkm.PORYGON_2]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Charge
  },
  [Pkm.PORYGON_Z]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing
  },
  [Pkm.ELECTRIKE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shock
  },
  [Pkm.MANECTRIC]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shock
  },
  [Pkm.MEGA_MANECTRIC]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.SHUPPET]: {
    attack: AnimationType.SpAttack,
    ability: AnimationType.Double
  },
  [Pkm.BANETTE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Double
  },
  [Pkm.MEGA_BANETTE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Double
  },
  [Pkm.HONEDGE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Head
  },
  [Pkm.DOUBLADE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.AEGISLASH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.CUBONE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.SpAttack
  },
  [Pkm.MAROWAK]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.ALOLAN_MAROWAK]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Punch
  },
  [Pkm.WHISMUR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Appeal
  },
  [Pkm.LOUDRED]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Appeal
  },
  [Pkm.EXPLOUD]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shoot
  },
  [Pkm.TYMPOLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.PALPITOAD]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.SEISMITOAD]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.SEWADDLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.SWADLOON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.LEAVANNY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.PIKIPEK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.TRUMBEAK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.TOUCANNON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.FLABEBE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swell
  },
  [Pkm.FLOETTE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swell
  },
  [Pkm.FLORGES]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Charge
  },
  [Pkm.JANGMO_O]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Charge
  },
  [Pkm.HAKAMO_O]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Charge
  },
  [Pkm.KOMMO_O]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.MELOETTA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.ALTARIA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.MEGA_ALTARIA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.CASTFORM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate
  },
  [Pkm.CASTFORM_SUN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.CASTFORM_RAIN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.CASTFORM_HAIL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.CORPHISH]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Hop
  },
  [Pkm.CRAWDAUNT]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Hop
  },
  [Pkm.JOLTIK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.GALVANTULA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.GENESECT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.RELICANTH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.HATENNA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.HATTREM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.HATTERENE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Charge
  },
  [Pkm.FENNEKIN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.BRAIXEN]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Hop
  },
  [Pkm.DELPHOX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.MAKUHITA]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack
  },
  [Pkm.HARIYAMA]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack
  },
  [Pkm.REGIELEKI]: {
    attack: AnimationType.Charge,
    ability: AnimationType.Charge
  },
  [Pkm.REGIDRAGO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.GUZZLORD]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.ETERNATUS]: {
    attack: AnimationType.Charge,
    ability: AnimationType.Attack
  },
  [Pkm.PONYTA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Walk
  },
  [Pkm.RAPIDASH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Walk
  },
  [Pkm.NINCADA]: {
    attack: AnimationType.MultiScratch,
    ability: AnimationType.Shoot
  },
  [Pkm.NINJASK]: {
    attack: AnimationType.MultiScratch,
    ability: AnimationType.Shoot
  },
  [Pkm.SHEDNINJA]: {
    attack: AnimationType.Scratch,
    ability: AnimationType.Charge
  },
  [Pkm.NOIBAT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hover
  },
  [Pkm.NOIVERN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hover
  },
  [Pkm.PUMPKABOO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.GOURGEIST]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hover
  },
  [Pkm.CACNEA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack
  },
  [Pkm.CACTURNE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack
  },
  [Pkm.TAUROS]: {
    attack: AnimationType.Stomp,
    ability: AnimationType.Attack
  },
  [Pkm.DEFAULT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.HAPPINY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shake
  },
  [Pkm.CHANSEY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack
  },
  [Pkm.BLISSEY]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Shoot
  },
  [Pkm.TAPU_KOKO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Emit
  },
  [Pkm.TAPU_LELE]: {
    attack: AnimationType.Hop,
    ability: AnimationType.Charge
  },
  [Pkm.STAKATAKA]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Sleep
  },
  [Pkm.BLACEPHALON]: {
    attack: AnimationType.Hop,
    ability: AnimationType.Attack
  },
  [Pkm.HOUNDOUR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.HOUNDOOM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.MEGA_HOUNDOOM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shake
  },
  [Pkm.CLAMPERL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.HUNTAIL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.GOREBYSS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.SMOOCHUM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.JYNX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Slap
  },
  [Pkm.SALANDIT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.SALAZZLE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.VENONAT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.VENOMOTH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.FlapAround
  },
  [Pkm.VOLTORB]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt
  },
  [Pkm.ELECTRODE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt
  },
  [Pkm.SLUGMA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.MAGCARGO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hurt
  },
  [Pkm.SNEASEL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DeepBreath
  },
  [Pkm.WEAVILE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.CROAGUNK]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Strike
  },
  [Pkm.TOXICROAK]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Strike
  },
  [Pkm.CHINCHOU]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.LANTURN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.POOCHYENA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.MIGHTYENA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.BRONZOR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack
  },
  [Pkm.BRONZONG]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Emit
  },
  [Pkm.DRIFLOON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swell
  },
  [Pkm.DRIFBLIM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Idle
  },
  [Pkm.SHROOMISH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.BRELOOM]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Charge
  },
  [Pkm.TENTACOOL]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Shoot
  },
  [Pkm.TENTACRUEL]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Charge
  },
  [Pkm.SNUBULL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.GRANBULL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.SEVIPER]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Shoot
  },
  [Pkm.VULPIX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.NINETALES]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.ALOLAN_VULPIX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.ALOLAN_NINETALES]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.BUIZEL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.FLOATZEL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.MAWILE]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Swing
  },
  [Pkm.KECLEON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.CARBINK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.DIANCIE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt
  },
  [Pkm.CHATOT]: {
    attack: AnimationType.Special0,
    ability: AnimationType.Charge
  },
  [Pkm.GOOMY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.SLIGOO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.GOODRA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.MEW]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shoot
  },
  [Pkm.BOUNSWEET]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.STEENEE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.TSAREENA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Kick
  },
  [Pkm.VOLCANION]: {
    attack: AnimationType.Charge,
    ability: AnimationType.Shoot
  },
  [Pkm.APPLIN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt
  },
  [Pkm.APPLETUN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt
  },
  [Pkm.OSHAWOTT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.DEWOTT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.SAMUROTT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Strike
  },
  [Pkm.SNOM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.FROSMOTH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.WAILMER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt
  },
  [Pkm.WAILORD]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt
  },
  [Pkm.DREEPY]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.DRAKLOAK]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.DRAGAPULT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.SNIVY]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Appeal
  },
  [Pkm.SERVINE]: {
    attack: AnimationType.Slice,
    ability: AnimationType.Charge
  },
  [Pkm.SERPERIOR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.SCORBUNNY]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Kick
  },
  [Pkm.RABOOT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Kick
  },
  [Pkm.CINDERACE]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Kick
  },
  [Pkm.POPPLIO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shoot
  },
  [Pkm.BRIONNE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shoot
  },
  [Pkm.PRIMARINA]: {
    attack: AnimationType.Charge,
    ability: AnimationType.Shoot
  },
  [Pkm.GOTHITA]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.GOTHORITA]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Charge
  },
  [Pkm.GOTHITELLE]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Charge
  },
  [Pkm.SANDSHREW]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Withdraw
  },
  [Pkm.SANDSLASH]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Withdraw
  },
  [Pkm.FARFETCH_D]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack
  },
  [Pkm.UNOWN_A]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_B]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_C]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_D]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_E]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_F]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_G]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_H]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_I]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_J]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_K]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_L]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_M]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_N]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_O]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_P]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_Q]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_R]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_S]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_T]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_U]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_V]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_W]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_X]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_Y]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_Z]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_QUESTION]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_EXCLAMATION]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.TAPU_FINI]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.TAPU_BULU]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.DIGLETT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DigIn
  },
  [Pkm.DUGTRIO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DigIn
  },
  [Pkm.ROWLET]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.DARTIX]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.DECIDUEYE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.ZORUA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.ZOROARK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.HISUI_ZORUA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.HISUI_ZOROARK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.FROAKIE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.FROGADIER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.GRENINJA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt
  },
  [Pkm.TYROGUE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.HITMONLEE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Kick
  },
  [Pkm.HITMONCHAN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Uppercut
  },
  [Pkm.HITMONTOP]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing
  },
  [Pkm.MIMIKYU]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.GRIMER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.MUK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.ALOLAN_GRIMER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.ALOLAN_MUK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.CARVANHA]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Swell
  },
  [Pkm.SHARPEDO]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Swell
  },
  [Pkm.PINECO]: {
    attack: AnimationType.Ricochet,
    ability: AnimationType.Charge
  },
  [Pkm.FORRETRESS]: {
    attack: AnimationType.Ricochet,
    ability: AnimationType.Charge
  },
  [Pkm.SEEL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.DEWGONG]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.ALOLAN_GEODUDE]: {
    attack: AnimationType.Punch,
    ability: AnimationType.Shoot
  },
  [Pkm.ALOLAN_GRAVELER]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Shoot
  },
  [Pkm.ALOLAN_GOLEM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.EKANS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.ARBOK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.MIME_JR]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Twirl
  },
  [Pkm.MR_MIME]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.ORIGIN_GIRATINA]: {
    attack: AnimationType.Scratch,
    ability: AnimationType.Shoot
  },
  [Pkm.PIROUETTE_MELOETTA]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Twirl
  },
  [Pkm.MELMETAL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.HOOPA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.HOOPA_UNBOUND]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.SILVALLY]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.TYPE_NULL]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.ZERAORA]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack
  },
  [Pkm.XERNEAS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.YVELTAL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.MARSHADOW]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.HOOTHOOT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.NOCTOWL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.BONSLEY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.SUDOWOODO]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Attack
  },
  [Pkm.PHIONE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.COMBEE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hover
  },
  [Pkm.VESPIQUEEN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack
  },
  [Pkm.SHUCKLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Withdraw
  }
}
