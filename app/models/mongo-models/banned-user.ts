import { Schema, model } from "mongoose"

export interface IBannedUser {
  uid: string
  name: string
  time: number
  author: string
}

const bannedUserSchema = new Schema({
  uid: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ""
  },
  time: {
    type: Number,
    default: Date.now()
  },
  author: {
    type: String,
    default: ""
  }
})

export default model<IBannedUser>("BannedUser", bannedUserSchema)
