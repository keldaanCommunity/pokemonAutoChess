import { ArraySchema } from "@colyseus/schema"
import { model, Schema } from "mongoose"
import { Emotion, Role, Title } from "../../types"
import { Language } from "../../types/enum/Language"

export interface IUserMetadata {
  uid: string
  displayName: string
  language: Language | ""
  avatar: string
  games: number
  wins: number
  exp: number
  level: number
  elo: number
  maxElo: number
  eventPoints: number
  maxEventPoints: number
  eventFinishTime: Date | null
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
  selectedEmotion: Emotion | null
  selectedShiny: boolean
  id: string
  played: number
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
  games: {
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
  maxElo: {
    type: Number,
    default: 1000
  },
  eventPoints: {
    type: Number,
    default: 0
  },
  maxEventPoints: {
    type: Number,
    default: 0
  },
  eventFinishTime: {
    type: Date,
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
      },
      played: {
        type: Number,
        default: 0
      }
    }
  }
})

export default model<IUserMetadata>("UserMetadata", userMetadataSchema)
