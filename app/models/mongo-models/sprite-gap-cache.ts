import { model, Schema } from "mongoose"

interface ISpriteGapCache {
  _id: string
  timestamp: number
  data: unknown
}

const spriteGapCacheSchema = new Schema(
  {
    _id: {
      type: String,
      required: true
    },
    timestamp: {
      type: Number,
      required: true
    },
    data: {
      type: Schema.Types.Mixed,
      required: true
    }
  },
  {
    versionKey: false
  }
)

export default model<ISpriteGapCache>(
  "SpriteGapCache",
  spriteGapCacheSchema,
  "sprite-gap-cache"
)
