import { MapSchema } from "@colyseus/schema"
import { Emotion, PkmWithCustom } from "../../types"
import { PkmIndex } from "../../types/enum/Pokemon"
import { IPokemonCollectionItem } from "../mongo-models/user-metadata"

export const EmotionIndex: Record<Emotion, number> = {
  [Emotion.NORMAL]: 0,
  [Emotion.HAPPY]: 1,
  [Emotion.PAIN]: 2,
  [Emotion.ANGRY]: 3,
  [Emotion.WORRIED]: 4,
  [Emotion.SAD]: 5,
  [Emotion.CRYING]: 6,
  [Emotion.SHOUTING]: 7,
  [Emotion.TEARY_EYED]: 8,
  [Emotion.DETERMINED]: 9,
  [Emotion.JOYOUS]: 10,
  [Emotion.INSPIRED]: 11,
  [Emotion.SURPRISED]: 12,
  [Emotion.DIZZY]: 13,
  [Emotion.SPECIAL0]: 14,
  [Emotion.SPECIAL1]: 15,
  [Emotion.SIGH]: 16,
  [Emotion.STUNNED]: 17,
  [Emotion.SPECIAL2]: 18,
  [Emotion.SPECIAL3]: 19
}

export const EmotionByIndex = Object.fromEntries(
  Object.entries(EmotionIndex).map(([emotion, index]) => [
    index,
    emotion as Emotion
  ])
)

/*
Schema used to expose in a compressed way (binary uint8) the player customizations for each pokemon
*/

export class PokemonCustoms extends MapSchema<number> {
  constructor(pokemonCollection: Map<string, IPokemonCollectionItem>) {
    super()
    pokemonCollection.forEach((item, index) => {
      const shiny = item.selectedShiny ? 1 : 0
      const emotionIndex = EmotionIndex[item.selectedEmotion] ?? 0
      this.set(index, (shiny ? 0b10000000 : 0) | emotionIndex)
    })
  }
}

export function getPkmWithCustom(
  index: string,
  customs?: PokemonCustoms
): PkmWithCustom {
  const custom =
    customs && index in customs
      ? customs[index.toString()]
      : customs && "get" in customs
        ? customs.get(index.toString())
        : 0
  const shiny = custom >= 0b10000000
  const emotionIndex = custom & 0b01111111
  return {
    name: PkmIndex[index],
    shiny,
    emotion: EmotionByIndex[emotionIndex] ?? Emotion.NORMAL
  }
}
