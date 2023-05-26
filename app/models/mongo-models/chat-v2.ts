import { Schema, model } from "mongoose"
import { IChatV2 } from "../../types/index"

const chatSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  payload: {
    type: String,
    required: true,
    default: ""
  },
  authorId: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  time: {
    type: Number,
    required: true,
    default: Date.now()
  }
})

export default model<IChatV2>("ChatV2", chatSchema)
