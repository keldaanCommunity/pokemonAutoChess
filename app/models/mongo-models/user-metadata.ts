import { model, Schema } from "mongoose"
import { CollectionUtils } from "../../core/collection"
import { Emotion, Role, Title } from "../../types"
import {
  IUserMetadataJSON,
  IUserMetadataMongo
} from "../../types/interfaces/UserMetadata"

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
    type: Date
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
      // OPTIMIZED: Single 5-byte field instead of multiple arrays for emotions and shiny emotions unlocked
      unlocked: {
        type: Buffer,
        default: () => Buffer.alloc(5, 0)
      },
      selectedEmotion: {
        type: String,
        enum: Emotion
      },
      selectedShiny: {
        type: Boolean
      },
      //LEGACY: Emotions and shinyEmotions are now stored in unlocked field
      //TO BE REMOVED after migration
      emotions: {
        type: [
          {
            type: String,
            enum: Emotion
          }
        ],
        required: false,
        default: () => {
          return undefined
        } // important otherwise mongoose will create empty array
      },
      shinyEmotions: {
        type: [
          {
            type: String,
            enum: Emotion
          }
        ],
        required: false,
        default: () => {
          return undefined
        } // important otherwise mongoose will create empty array
      },
      // END LEGACY
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

export default model<IUserMetadataMongo>("UserMetadata", userMetadataSchema)

export function toUserMetadataJSON(user): IUserMetadataJSON {
  const pokemonCollection: {
    [index: string]: IUserMetadataJSON["pokemonCollection"][string]
  } = {}
  user.pokemonCollection.forEach((item, index) => {
    pokemonCollection[index] = CollectionUtils.toCollectionItemClient(item)
  })
  return {
    ...user.toObject(),
    pokemonCollection
  }
}
