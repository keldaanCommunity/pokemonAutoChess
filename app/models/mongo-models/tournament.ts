import { Schema, model } from "mongoose"
import { ITournament } from "../../types/interfaces/Tournament"

const tournamentPlayerSchema = new Schema({
  name: String,
  avatar: String,
  elo: Number,
  ranks: [Number],
  eliminated: Boolean
})

const tournamentBracketSchema = new Schema({
  name: String,
  playersId: [String],
  finished: Boolean
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
    of: tournamentBracketSchema
  },
  finished: Boolean
})

export const Tournament = model<ITournament>("Tournament", tournamentSchema)

export default Tournament
