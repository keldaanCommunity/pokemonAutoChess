import { model, Schema } from "mongoose"

export interface ITwitchBlacklistedStreamer {
  streamerLogin: string
  reason?: string
  createdBy: string
  createdAt?: Date
  updatedAt?: Date
}

const twitchBlacklistedStreamerSchema = new Schema(
  {
    streamerLogin: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true
    },
    reason: {
      type: String,
      default: ""
    },
    createdBy: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
)

export default model<ITwitchBlacklistedStreamer>(
  "TwitchBlacklistedStreamer",
  twitchBlacklistedStreamerSchema
)
