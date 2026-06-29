import { EffectEnum } from "../../types/enum/Effect"
import { Rarity } from "../../types/enum/Game"
import { type FishingRod, Item, type ShinyItem } from "../../types/enum/Item"
import { Synergy } from "../../types/enum/Synergy"

export const SynergyTiers = {
  [Synergy.NORMAL]: [
    EffectEnum.STAMINA,
    EffectEnum.STRENGTH,
    EffectEnum.ENDURE,
    EffectEnum.PURE_POWER
  ],
  [Synergy.GRASS]: [
    EffectEnum.INGRAIN,
    EffectEnum.GROWTH,
    EffectEnum.SPORE,
    EffectEnum.OVERGROW
  ],
  [Synergy.FIRE]: [
    EffectEnum.FLAME_BODY,
    EffectEnum.WILDFIRE,
    EffectEnum.BLAZE,
    EffectEnum.DESOLATE_LAND
  ],
  [Synergy.WATER]: [
    EffectEnum.RAIN_DANCE,
    EffectEnum.DRIZZLE,
    EffectEnum.PRIMORDIAL_SEA
  ],
  [Synergy.ELECTRIC]: [
    EffectEnum.RISING_VOLTAGE,
    EffectEnum.POWER_SURGE,
    EffectEnum.SUPERCHARGED
  ],
  [Synergy.FIGHTING]: [
    EffectEnum.GUTS,
    EffectEnum.STURDY,
    EffectEnum.DEFIANT,
    EffectEnum.COACHING
  ],
  [Synergy.PSYCHIC]: [
    EffectEnum.PRECOGNITION,
    EffectEnum.AURA,
    EffectEnum.TRANSCENDENCE
  ],
  [Synergy.DARK]: [
    EffectEnum.HONE_CLAWS,
    EffectEnum.ASSURANCE,
    EffectEnum.BEAT_UP
  ],
  [Synergy.STEEL]: [
    EffectEnum.STEEL_SURGE,
    EffectEnum.STEEL_SPIKE,
    EffectEnum.CORKSCREW_CRASH,
    EffectEnum.MAX_MELTDOWN
  ],
  [Synergy.GROUND]: [
    EffectEnum.TILLER,
    EffectEnum.DIGGER,
    EffectEnum.DRILLER,
    EffectEnum.DEEP_MINER
  ],
  [Synergy.POISON]: [
    EffectEnum.POISONOUS,
    EffectEnum.VENOMOUS,
    EffectEnum.TOXIC
  ],
  [Synergy.DRAGON]: [
    EffectEnum.DRAGON_ENERGY,
    EffectEnum.DRAGON_SCALES,
    EffectEnum.DRAGON_DANCE
  ],
  [Synergy.FIELD]: [
    EffectEnum.BULK_UP,
    EffectEnum.RAGE,
    EffectEnum.ANGER_POINT
  ],
  [Synergy.MONSTER]: [
    EffectEnum.PURSUIT,
    EffectEnum.BRUTAL_SWING,
    EffectEnum.POWER_TRIP,
    EffectEnum.MERCILESS
  ],
  [Synergy.HUMAN]: [
    EffectEnum.MEDITATE,
    EffectEnum.FOCUS_ENERGY,
    EffectEnum.CALM_MIND
  ],
  [Synergy.AQUATIC]: [
    EffectEnum.SWIFT_SWIM,
    EffectEnum.HYDRATION,
    EffectEnum.WATER_VEIL,
    EffectEnum.SURGE_SURFER
  ],
  [Synergy.BUG]: [
    EffectEnum.COCOON,
    EffectEnum.INFESTATION,
    EffectEnum.HORDE,
    EffectEnum.HEART_OF_THE_SWARM
  ],
  [Synergy.FLYING]: [
    EffectEnum.TAILWIND,
    EffectEnum.FEATHER_DANCE,
    EffectEnum.MAX_AIRSTREAM,
    EffectEnum.SKYDIVE
  ],
  [Synergy.FLORA]: [
    EffectEnum.COTTONWEED,
    EffectEnum.FLYCATCHER,
    EffectEnum.FRAGRANT,
    EffectEnum.FLOWER_POWER
  ],
  [Synergy.ROCK]: [
    EffectEnum.BATTLE_ARMOR,
    EffectEnum.MOUTAIN_RESISTANCE,
    EffectEnum.DIAMOND_STORM
  ],
  [Synergy.GHOST]: [
    EffectEnum.CURSE_OF_VULNERABILITY,
    EffectEnum.CURSE_OF_WEAKNESS,
    EffectEnum.CURSE_OF_TORMENT,
    EffectEnum.CURSE_OF_FATE
  ],
  [Synergy.FAIRY]: [
    EffectEnum.AROMATIC_MIST,
    EffectEnum.FAIRY_WIND,
    EffectEnum.STRANGE_STEAM,
    EffectEnum.MOON_FORCE
  ],
  [Synergy.ICE]: [
    EffectEnum.CHILLY,
    EffectEnum.FROSTY,
    EffectEnum.FREEZING,
    EffectEnum.SHEER_COLD
  ],
  [Synergy.FOSSIL]: [
    EffectEnum.ANCIENT_POWER,
    EffectEnum.ELDER_POWER,
    EffectEnum.FORGOTTEN_POWER
  ],
  [Synergy.SOUND]: [EffectEnum.LARGO, EffectEnum.ALLEGRO, EffectEnum.PRESTO],
  [Synergy.ARTIFICIAL]: [
    EffectEnum.DUBIOUS_DISC,
    EffectEnum.LINK_CABLE,
    EffectEnum.GOOGLE_SPECS
  ],
  [Synergy.BABY]: [
    EffectEnum.HATCHER,
    EffectEnum.BREEDER,
    EffectEnum.GOLDEN_EGGS
  ],
  [Synergy.LIGHT]: [
    EffectEnum.SHINING_RAY,
    EffectEnum.LIGHT_PULSE,
    EffectEnum.ETERNAL_LIGHT,
    EffectEnum.MAX_ILLUMINATION
  ],
  [Synergy.WILD]: [
    EffectEnum.QUICK_FEET,
    EffectEnum.RUN_AWAY,
    EffectEnum.HUSTLE,
    EffectEnum.BERSERK
  ],
  [Synergy.AMORPHOUS]: [
    EffectEnum.FLUID,
    EffectEnum.SHAPELESS,
    EffectEnum.ETHEREAL
  ],
  [Synergy.GOURMET]: [
    EffectEnum.APPETIZER,
    EffectEnum.LUNCH_BREAK,
    EffectEnum.BANQUET
  ],
  [Synergy.STELLAR]: [
    EffectEnum.TERASTAL,
    EffectEnum.TERA_BLAST,
    EffectEnum.TERA_STAR_STORM
  ]
} satisfies { [key in Synergy]: readonly EffectEnum[] }

export type SynergyTier<T extends Synergy = Synergy> =
  (typeof SynergyTiers)[T][number]

export const SynergyTiersThresholds: { [key in Synergy]: number[] } = {
  [Synergy.NORMAL]: [3, 5, 7, 9],
  [Synergy.GRASS]: [3, 5, 7, 9],
  [Synergy.FIRE]: [2, 4, 6, 8],
  [Synergy.WATER]: [3, 6, 9],
  [Synergy.ELECTRIC]: [3, 5, 7],
  [Synergy.FIGHTING]: [2, 4, 6, 8],
  [Synergy.PSYCHIC]: [3, 5, 7],
  [Synergy.DARK]: [3, 5, 7],
  [Synergy.STEEL]: [2, 4, 6, 8],
  [Synergy.GROUND]: [2, 4, 6, 8],
  [Synergy.POISON]: [3, 5, 7],
  [Synergy.DRAGON]: [3, 5, 7],
  [Synergy.FIELD]: [3, 6, 9],
  [Synergy.MONSTER]: [2, 4, 6, 8],
  [Synergy.HUMAN]: [2, 4, 6],
  [Synergy.AQUATIC]: [2, 4, 6, 8],
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
  [Synergy.WILD]: [2, 4, 6, 9],
  [Synergy.AMORPHOUS]: [3, 5, 7],
  [Synergy.GOURMET]: [3, 4, 5],
  [Synergy.STELLAR]: [1, 2, 3]
}

export const FishRarityProbability: {
  [rod in FishingRod]: {
    [key in Rarity]?: number
  }
} = {
  [Item.OLD_ROD]: {
    [Rarity.SPECIAL]: 0.55,
    [Rarity.COMMON]: 0.35,
    [Rarity.UNCOMMON]: 0.1,
    [Rarity.RARE]: 0,
    [Rarity.EPIC]: 0
  },
  [Item.GOOD_ROD]: {
    [Rarity.SPECIAL]: 0.35,
    [Rarity.COMMON]: 0.25,
    [Rarity.UNCOMMON]: 0.3,
    [Rarity.RARE]: 0.1,
    [Rarity.EPIC]: 0
  },
  [Item.SUPER_ROD]: {
    [Rarity.SPECIAL]: 0.35,
    [Rarity.COMMON]: 0.05,
    [Rarity.UNCOMMON]: 0.25,
    [Rarity.RARE]: 0.25,
    [Rarity.EPIC]: 0.1
  }
}

export const MONSTER_ATTACK_BUFF_PER_SYNERGY_TIER = [0, 3, 6, 10, 10]
export const MONSTER_AP_BUFF_PER_SYNERGY_TIER = [0, 10, 20, 30, 30]
export const MONSTER_MAX_HP_BUFF_FACTOR_PER_SYNERGY_TIER = [
  0, 0.2, 0.4, 0.6, 0.6
]

export const FIELD_HEAL_PER_SYNERGY_TIER = [0, 30, 40, 50]
export const FIELD_SPEED_BUFF_PER_SYNERGY_TIER = [0, 15, 20, 25]

export const AMORPHOUS_SPEED_BUFF_PER_SYNERGY_TIER = [0, 1, 3, 5]
export const AMORPHOUS_HP_BUFF_PER_SYNERGY_TIER = [0, 3, 6, 10]

export const GROUND_DEF_BUFF_PER_SYNERGY_TIER = [0, 1, 2, 3, 3]
export const GROUND_ATK_BUFF_PER_SYNERGY_TIER = [0, 3, 5, 8, 8]

export const FIRE_ATK_BUFF_PER_SYNERGY_TIER = [0, 0, 1, 2, 3]

export const SOUND_ATK_BUFF_PER_SYNERGY_TIER = [0, 2, 1, 1]
export const SOUND_SPEED_BUFF_PER_SYNERGY_TIER = [0, 0, 5, 5]
export const SOUND_PP_GAIN_PER_SYNERGY_TIER = [0, 0, 0, 3]

export const FAIRY_WANDS_BY_SYNERGY_LEVEL = [
  [Item.LONG_WAND, Item.SPIRIT_WAND, Item.HP_SWAP_WAND, Item.BLAST_WAND],
  [Item.SLUMBER_WAND, Item.SLOW_WAND, Item.PETRIFY_WAND, Item.CONFUSE_WAND],
  [
    Item.TWO_EDGED_WAND,
    Item.POUNCE_WAND,
    Item.SURROUND_WAND,
    Item.GUIDING_WAND
  ],
  [Item.TUNNEL_WAND, Item.WHIRLWIND_WAND, Item.SWITCHER_WAND, Item.WARP_WAND]
]

export const UNOWN_ENCOUNTER_CHANCE = 0.033
export const SHINY_UNOWN_ENCOUNTER_CHANCE = 0.05
export const SHARDS_PER_UNOWN_WANDERER = 50
export const SHARDS_PER_SHINY_UNOWN_WANDERER = 250

export const GOLDEN_BERRY_TREE_TYPES = [
  Item.GOLDEN_RAZZ_BERRY,
  Item.GOLDEN_NANAB_BERRY,
  Item.GOLDEN_PINAP_BERRY
]

export const GoldenEggItems = [
  Item.DYNAMAX_BAND,
  Item.SHINY_STONE,
  Item.RARE_CANDY,
  Item.EVIOLITE,
  Item.GOLD_MASK,
  Item.GOLD_BOTTLE_CAP,
  Item.ABSORB_BULB,
  Item.SACRED_ASH,
  Item.STAR_PIECE,
  Item.REPEAT_BALL,
  Item.GOLD_BOW
] satisfies ShinyItem[]

// Synergy color mapping extracted from SVG fill colors
export const SYNERGY_COLORS: Record<Synergy, `#${string}`> = {
  NORMAL: "#FEFEFE",
  FIRE: "#FF9024",
  WATER: "#2DA2FD",
  GRASS: "#17B300",
  ELECTRIC: "#FDFF4A",
  ICE: "#C3E4EE",
  FIGHTING: "#F33218",
  POISON: "#88D7A0",
  GROUND: "#C6964A",
  FLYING: "#B2E9FF",
  PSYCHIC: "#B955D2",
  BUG: "#FFFE66",
  ROCK: "#E7E5AF",
  GHOST: "#876DAD",
  DRAGON: "#B87333",
  DARK: "#A6A6A6",
  STEEL: "#DBDBDB",
  FAIRY: "#FFAFD1",
  FIELD: "#DE8A4E",
  AQUATIC: "#14C8C8",
  MONSTER: "#00B464",
  AMORPHOUS: "#E5B2F4",
  WILD: "#B22334",
  SOUND: "#FF6095",
  FLORA: "#FF60F1",
  BABY: "#FFD79A",
  HUMAN: "#FDBB8B",
  LIGHT: "#FFF896",
  GOURMET: "#FF8473",
  FOSSIL: "#D2D35B",
  ARTIFICIAL: "#EDEDED",
  STELLAR: "#00FFFF"
}
