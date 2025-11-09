import { Rarity } from "../../types/enum/Game"

export const SHOP_SIZE = 6
export const NB_UNIQUE_PROPOSITIONS = 6

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
  [Rarity.HATCH]: 9,
  [Rarity.UNIQUE]: 10,
  [Rarity.LEGENDARY]: 20
})

export const RarityColor: { [key in Rarity]: string } = {
  [Rarity.COMMON]: "#a0a0a0",
  [Rarity.UNCOMMON]: "#3bc95e",
  [Rarity.RARE]: "#41bfcc",
  [Rarity.EPIC]: "#927FFF",
  [Rarity.ULTRA]: "#E53B3B",
  [Rarity.UNIQUE]: "#ffffff",
  [Rarity.LEGENDARY]: "#e6cb49",
  [Rarity.SPECIAL]: "#E58EE5",
  [Rarity.HATCH]: "#b9915a"
}

export const BoosterRarityProbability: { [key in Rarity]: number } = {
  [Rarity.COMMON]: 0.12,
  [Rarity.UNCOMMON]: 0.2,
  [Rarity.RARE]: 0.2,
  [Rarity.EPIC]: 0.18,
  [Rarity.ULTRA]: 0.06,
  [Rarity.UNIQUE]: 0.1,
  [Rarity.LEGENDARY]: 0.05,
  [Rarity.HATCH]: 0.06,
  [Rarity.SPECIAL]: 0.03
}

export const RarityProbabilityPerLevel: { [key: number]: number[] } = {
  1: [1, 0, 0, 0, 0],
  2: [1, 0, 0, 0, 0],
  3: [0.7, 0.3, 0, 0, 0],
  4: [0.5, 0.4, 0.1, 0, 0],
  5: [0.36, 0.42, 0.2, 0.02, 0],
  6: [0.25, 0.4, 0.3, 0.05, 0],
  7: [0.16, 0.33, 0.35, 0.15, 0.01],
  8: [0.11, 0.27, 0.35, 0.22, 0.05],
  9: [0.05, 0.2, 0.35, 0.3, 0.1]
}

/* Special Pokemon rates */
export const DITTO_RATE = 0.005
export const MIN_STAGE_FOR_DITTO = 6
export const KECLEON_RATE = 1 / 400
export const ARCEUS_RATE = 1 / 400
export const UNOWN_RATE_AMNESIA = 5 / 100
export const UNOWN_LIGHT_SCREEN_NB_SHOPS_INTERVAL = 3
export const UNOWN_EERIE_SPELL_NB_SHOPS_INTERVAL = 10
export const FALINKS_TROOPER_RATE = 4 / 100
export const REMORAID_RATE = 1 / 3

export const MAGNET_PULL_RATE_PER_RARITY: { [key in Rarity]?: number } = {
  [Rarity.COMMON]: 0.15,
  [Rarity.UNCOMMON]: 0.28,
  [Rarity.RARE]: 0.15,
  [Rarity.SPECIAL]: 0.35,
  [Rarity.EPIC]: 0.05,
  [Rarity.ULTRA]: 0.02
}

export const PVE_WILD_CHANCE = 5 / 100

export const INCENSE_CHANCE = 5 / 100
export const HONEY_CHANCE = 5 / 100
export const REPEAT_BALL_LEGENDARY_CAP = 120
export const REPEAT_BALL_UNIQUE_CAP = 80
export const REPEAT_BALL_UNIQUE_INTERVAL = 10

export const HIGH_ROLLER_CHANCE = 2 / 100

/* sell prices */
export const SellPrices = {
  EGG: 2,
  SHINY_EGG: 10,
  DITTO: 5,
  FALINKS_TROOPER: 5,
  MELTAN: 0,
  MAGIKARP: 0,
  GYARADOS: 10,
  FEEBAS: 1,
  MILOTIC: 10,
  WISHIWASHI: 3,
  WISHIWASHI_SCHOOL: 10,
  REMORAID: 2,
  OCTILLERY: 7,
  UNOWN: 1,
  HATCH: [3, 4, 5],
  UNIQUE: 10,
  UNIQUE_DUO: 6,
  LEGENDARY: 20,
  LEGENDARY_DUO: 10
}

export const BuyPrices = {
  DITTO: 5,
  FALINKS_TROOPER: 5,
  MELTAN: 0,
  UNOWN: 1
}
