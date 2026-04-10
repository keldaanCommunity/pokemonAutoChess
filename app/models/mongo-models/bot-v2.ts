import { model, Schema } from "mongoose"
import { Emotion } from "../../types"
import type { IBot } from "../../types/models/bot-v2"
import { Item } from "../../types/enum/Item"
import { Pkm } from "../../types/enum/Pokemon"

const pkm = new Schema({
  name: {
    type: String,
    enum: Pkm,
    required: true
  },
  x: {
    type: Number,
    min: 0,
    max: 7,
    required: true
  },
  y: {
    type: Number,
    min: 0,
    max: 3,
    required: true
  },
  items: [
    {
      type: String,
      enum: Item
    }
  ],
  emotion: {
    type: String,
    required: false,
    enum: Emotion
  },
  shiny: {
    type: Boolean,
    required: false
  }
})

const step = new Schema({
  board: [pkm],
  roundsRequired: {
    type: Number,
    required: true
  }
})

const bot = new Schema(
  {
    id: {
      type: String,
      required: true,
      default: crypto.randomUUID()
    },
    approved: {
      type: Boolean,
      default: false
    },
    name: {
      type: String
    },
    avatar: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    elo: {
      type: Number,
      required: true
    },
    steps: [step]
  },
  {
    toJSON: {
      transform: function (doc, ret: any) {
        delete ret._id
        delete ret.__v
        if (ret.steps)
          ret.steps.forEach((step) => {
            step.board.forEach((board) => {
              delete board._id
            })
            delete step._id
          })
      }
    }
  }
)

const BotV2 = model<IBot>("botV2", bot)

export { BotV2 }
