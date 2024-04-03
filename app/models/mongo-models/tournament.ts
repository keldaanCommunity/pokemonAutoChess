import { Schema, model } from "mongoose"

export interface ITournament {
  id?: string
  name: string
  startDate: string
  registrations: string[]
}

const tournamentSchema = new Schema({
  name: String,
  startDate: String,
  registrations: [String]
})

export const Tournament = model<ITournament>("Tournament", tournamentSchema)

export default Tournament
