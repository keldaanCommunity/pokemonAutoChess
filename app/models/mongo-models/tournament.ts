import { Schema, model } from "mongoose"

export interface ITournament {
  name: string
  startDate: string
}

const tournamentSchema = new Schema({
  name: {
    type: String
  },
  startDate: {
    type: String
  }
})

export default model<ITournament>("Tournament", tournamentSchema)
