import { Schema, model } from "mongoose"
import { nanoid } from "nanoid"
import { Emotion, PkmWithCustom } from "../../types"
import { Item } from "../../types/enum/Item"
import { Pkm } from "../../types/enum/Pokemon"

export interface IDetailledPokemon extends PkmWithCustom {
  name: Pkm
  x: number
  y: number
  items: Item[]
  emotion?: Emotion
  shiny?: boolean
}

export interface IStep {
  board: IDetailledPokemon[]
  roundsRequired: number
}

export interface IBot {
  avatar: string
  author: string
  elo: number
  steps: IStep[]
  name: string
  id: string
}

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
      default: nanoid()
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
      transform: function (doc, ret) {
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
