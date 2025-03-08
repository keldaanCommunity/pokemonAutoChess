import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema"
import { Emotion } from "../../types"
import { IPokemonCollectionItem } from "../mongo-models/user-metadata"

export class PokemonCollection extends MapSchema<IPokemonCollectionItem> {
  constructor(pokemonCollection?: Map<string, IPokemonCollectionItem>) {
    super()
    if (pokemonCollection) {
      pokemonCollection.forEach((value, key) =>
        this.set(key, new PokemonCollectionItem(key, value))
      )
    }
  }
}

export class PokemonCollectionItem
  extends Schema
  implements IPokemonCollectionItem
{
  @type("uint16") dust: number
  @type(["string"]) emotions = new ArraySchema<Emotion>()
  @type(["string"]) shinyEmotions = new ArraySchema<Emotion>()
  @type("string") selectedEmotion: Emotion
  @type("boolean") selectedShiny: boolean
  @type("string") id: string

  constructor(id: string, p?: IPokemonCollectionItem) {
    super()
    this.id = id
    if (p) {
      this.dust = p.dust
      p.emotions.forEach((e) => this.emotions.push(e))
      p.shinyEmotions.forEach((e) => this.shinyEmotions.push(e))
      this.selectedEmotion = p.selectedEmotion
      this.selectedShiny = p.selectedShiny
    } else {
      this.dust = 0
      this.selectedEmotion = Emotion.NORMAL
      this.selectedShiny = false
    }
  }
}
