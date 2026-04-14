import { model, Schema } from "mongoose"
import { ExpThreshold } from "../../config"
import { GADGETS_UNLOCKED_BY_LEVEL } from "../../config/game/gadgets"
import { CollectionUtils } from "../../core/collection"
import { notificationsService } from "../../services/notifications"
import { Emotion, Role, Title } from "../../types"
import {
  IPokemonCollectionItemMongo,
  IUserMetadataJSON,
  IUserMetadataLean,
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
    type: Date,
    sparse: true
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

userMetadataSchema.index(
  { displayName: 1 },
  { collation: { locale: "en", strength: 2 } }
)
userMetadataSchema.index({ titles: 1 })

export default model<IUserMetadataMongo>("UserMetadata", userMetadataSchema)

export function toLeanUserMetadata(
  user: IUserMetadataLean | IUserMetadataMongo
): IUserMetadataMongo {
  const pokemonCollection = new Map<string, IPokemonCollectionItemMongo>()
  const collectionEntries =
    user.pokemonCollection instanceof Map
      ? user.pokemonCollection.entries()
      : Object.entries(user.pokemonCollection ?? {})

  for (const [key, item] of collectionEntries) {
    pokemonCollection.set(key, {
      ...item,
      unlocked: Buffer.isBuffer(item?.unlocked)
        ? item.unlocked
        : item?.unlocked?.buffer
          ? Buffer.from(item.unlocked.buffer)
          : Buffer.alloc(5, 0)
    })
  }
  return {
    ...user,
    pokemonCollection
  } as IUserMetadataMongo
}

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

export function giveUserExp(user: IUserMetadataMongo, exp: number) {
  if (user.exp + exp >= ExpThreshold) {
    user.level += 1
    user.booster += 1
    user.exp = user.exp + exp - ExpThreshold

    if (user.level <= 2) {
      // Add level up notification
      notificationsService.addNotification(
        user.uid,
        "level_up",
        user.level.toString()
      )
    }

    if (user.level in GADGETS_UNLOCKED_BY_LEVEL) {
      notificationsService.addNotification(
        user.uid,
        "new_gadget",
        GADGETS_UNLOCKED_BY_LEVEL[user.level].name
      )
    }
  } else {
    user.exp = user.exp + exp
  }
  user.exp = !isNaN(user.exp) ? user.exp : 0
}
