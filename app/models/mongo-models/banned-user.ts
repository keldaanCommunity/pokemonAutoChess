import { Schema, model } from "mongoose"

export interface IBannedUser {
  uid: string
}

const bannedUserSchema = new Schema({
  uid: {
    type: String
  }
})

export default model<IBannedUser>("BannedUser", bannedUserSchema)
