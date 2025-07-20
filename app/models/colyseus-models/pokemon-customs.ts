import { MapSchema } from "@colyseus/schema"
import { CollectionEmotions, Emotion, PkmWithCustom } from "../../types"
import { PkmIndex } from "../../types/enum/Pokemon"
import { IPokemonCollectionItemMongo } from "../../types/interfaces/UserMetadata"

/*
Schema used to expose in a compressed way (binary uint8) the player customizations for each pokemon
*/

export class PokemonCustoms extends MapSchema<number> {
  constructor(pokemonCollection: Map<string, IPokemonCollectionItemMongo>) {
    super()
    pokemonCollection.forEach((item, index) => {
      const shiny = item.selectedShiny ? 1 : 0
      let emotionIndex = CollectionEmotions.indexOf(item.selectedEmotion ?? Emotion.NORMAL)
      if (emotionIndex === -1) emotionIndex = 0
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
    emotion: CollectionEmotions[emotionIndex] ?? Emotion.NORMAL
  }
}
