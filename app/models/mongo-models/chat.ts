import { Schema, model } from "mongoose"

export interface IChat {
  payload: string
  name: string
  avatar: string
  time: number
}

const chatSchema = new Schema({
  payload: {
    type: String
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  time: {
    type: Number
  }
})

export default model<IChat>("Chat", chatSchema)
