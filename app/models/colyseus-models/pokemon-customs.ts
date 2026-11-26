import { MapSchema } from "@colyseus/schema"
import { CollectionEmotions, Emotion, type PkmWithCustom } from "../../types"
import { PkmIndex } from "../../types/enum/Pokemon"
import type { IPokemonCollectionItemForPlayer } from "../../types/interfaces/UserMetadata"

/*
Schema used to expose in a compressed way (binary uint8) the player customizations for each pokemon
*/

export class PokemonCustoms extends MapSchema<number> {
  constructor(
    pokemonCollection: Map<string, IPokemonCollectionItemForPlayer | number>
  ) {
    super()
    pokemonCollection.forEach((item, index) => {
      if (typeof item === "number") {
        this.set(index, item)
        return
      }
      const shiny = item.selectedShiny ? 1 : 0
      let emotionIndex = CollectionEmotions.indexOf(
        item.selectedEmotion ?? Emotion.NORMAL
      )
      if (emotionIndex === -1) emotionIndex = 0
      const value = (shiny ? 0b10000000 : 0) | emotionIndex
      // Only ship entries that actually diverge from the default (non-shiny + NORMAL,
      // which is exactly byte 0). getPkmWithCustom() maps an absent key back to byte 0
      if (value !== 0) {
        this.set(index, value)
      }
    })
  }
}

export function getPkmWithCustom(
  index: string,
  customs?: PokemonCustoms
): PkmWithCustom {
  // An absent key means "default customisation" (non-shiny + NORMAL emotion), which is
  // byte 0 - PokemonCustoms omits those entries to keep the initial state sync small.
  const custom = customs?.get(index.toString()) ?? 0
  const shiny = custom >= 0b10000000
  const emotionIndex = custom & 0b01111111
  return {
    name: PkmIndex[index],
    shiny,
    emotion: CollectionEmotions[emotionIndex] ?? Emotion.NORMAL
  }
}
