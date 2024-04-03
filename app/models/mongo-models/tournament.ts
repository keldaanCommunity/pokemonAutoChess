import { Schema, model } from "mongoose"
import { ITournament } from "../../types/interfaces/Tournament"

const tournamentPlayerSchema = new Schema({
  name: String,
  avatar: String,
  elo: Number,
  score: Number,
  ranks: [Number],
  eliminated: Boolean
})

const tournamentSchema = new Schema({
  name: String,
  startDate: String,
  players: {
    type: Map,
    of: tournamentPlayerSchema
  },
  brackets: {
    type: Map,
    of: [String]
  }
})

export const Tournament = model<ITournament>("Tournament", tournamentSchema)

export default Tournament
