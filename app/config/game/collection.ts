import { Emotion } from "../../types/enum/Emotion"
import { Rarity } from "../../types/enum/Game"

export const DUST_PER_BOOSTER = 50
export const DUST_PER_SHINY = 250

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

// should be proportional to rarity
export const BoosterPriceByRarity: { [key in Rarity]: number } = {
  [Rarity.COMMON]: 600,
  [Rarity.UNCOMMON]: 1000,
  [Rarity.RARE]: 1000,
  [Rarity.EPIC]: 900,
  [Rarity.ULTRA]: 300,
  [Rarity.UNIQUE]: 500,
  [Rarity.LEGENDARY]: 250,
  [Rarity.HATCH]: 300,
  [Rarity.SPECIAL]: 500 // special is a bit more expensive due to unowns farming
}
