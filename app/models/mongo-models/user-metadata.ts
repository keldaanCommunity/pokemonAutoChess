import { Schema, model } from "mongoose"
import { ArraySchema } from "@colyseus/schema"
import { Emotion, Role, Title } from "../../types"
import { Language } from "../../types/enum/Language"

export interface IUserMetadata {
  uid: string
  displayName: string
  language: Language | ""
  avatar: string
  wins: number
  exp: number
  level: number
  elo: number
  pokemonCollection: Map<string, IPokemonCollectionItem>
  booster: number
  titles: Title[]
  title: "" | Title
  role: Role
  banned?: boolean
}

export interface IPokemonCollectionItem {
  dust: number
  emotions: Emotion[] | ArraySchema<Emotion>
  shinyEmotions: Emotion[] | ArraySchema<Emotion>
  selectedEmotion: Emotion
  selectedShiny: boolean
  id: string
}

const userMetadataSchema = new Schema({
  uid: {
    type: String
  },
  displayName: {
    type: String
  },
  language: {
    type: String,
    default: "en"
  },
  avatar: {
    type: String,
    default: "0019/Normal"
  },
  wins: {
    type: Number,
    default: 0
  },
  exp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 0
  },
  elo: {
    type: Number,
    default: 1000
  },
  booster: {
    type: Number,
    default: 0
  },
  title: {
    type: String
  },
  role: {
    type: String,
    enum: Role,
    default: Role.BASIC
  },
  banned: {
    type: Boolean,
    default: false
  },
  titles: [
    {
      type: String,
      enum: Title
    }
  ],
  pokemonCollection: {
    type: Map,
    of: {
      dust: {
        type: Number
      },
      selectedEmotion: {
        type: String,
        enum: Emotion
      },
      emotions: [
        {
          type: String,
          enum: Emotion
        }
      ],
      shinyEmotions: [
        {
          type: String,
          enum: Emotion
        }
      ],
      selectedShiny: {
        type: Boolean
      },
      id: {
        type: String
      }
    }
  }
})

export default model<IUserMetadata>("UserMetadata", userMetadataSchema)
