import { IPokemonConfig } from "../mongo-models/user-metadata"
import { Schema, type, ArraySchema } from "@colyseus/schema"
import { Emotion } from "../../types"

export default class PokemonConfig extends Schema implements IPokemonConfig {
  @type("uint16") dust: number
  @type(["string"]) emotions = new ArraySchema<Emotion>()
  @type(["string"]) shinyEmotions = new ArraySchema<Emotion>()
  @type("string") selectedEmotion: Emotion
  @type("boolean") selectedShiny: boolean
  @type("string") id: string

  constructor(id: string, p?: IPokemonConfig) {
    super()
    this.id = id
    if (p) {
      this.dust = p.dust
      p.emotions.forEach((e) => this.emotions.push(e))
      p.shinyEmotions.forEach((e) => this.shinyEmotions.push(e))
      this.selectedEmotion = p.selectedEmotion
      this.selectedShiny = p.selectedShiny
      this
    } else {
      this.dust = 0
      this.selectedEmotion = Emotion.NORMAL
      this.selectedShiny = false
    }
  }
}
