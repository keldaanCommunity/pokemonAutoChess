import { Rarity } from "../../types/enum/Game"
import { FishingRod, Item } from "../../types/enum/Item"
import { Synergy } from "../../types/enum/Synergy"

export const SynergyTriggers: { [key in Synergy]: number[] } = {
  [Synergy.NORMAL]: [3, 5, 7, 9],
  [Synergy.GRASS]: [3, 5, 7],
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
  [Synergy.GOURMET]: [3, 4, 5]
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

export const MONSTER_ATTACK_BUFF_PER_SYNERGY_LEVEL = [3, 6, 10, 10]
export const MONSTER_AP_BUFF_PER_SYNERGY_LEVEL = [10, 20, 30, 30]
export const MONSTER_MAX_HP_BUFF_FACTOR_PER_SYNERGY_LEVEL = [0.2, 0.4, 0.6, 0.6]

export const FIELD_HEAL_PER_SYNERGY_LEVEL = [30, 40, 50]
export const FIELD_SPEED_BUFF_PER_SYNERGY_LEVEL = [15, 20, 25]