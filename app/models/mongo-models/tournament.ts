import { Schema, model } from "mongoose"

export interface ITournament {
  id: string
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

export const Tournament = model<ITournament>("Tournament", tournamentSchema)

export default Tournament
