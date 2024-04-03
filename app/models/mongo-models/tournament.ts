import { Schema, model } from "mongoose"

export interface ITournamentPlayer {
  name: string
  avatar: string
  elo: number
  score: number
  ranks: number[]
  eliminated: boolean
}

const tournamentPlayerSchema = new Schema({
  name: String,
  avatar: String,
  elo: Number,
  score: Number,
  ranks: [Number],
  eliminated: Boolean
})

export interface ITournament {
  id: string
  name: string
  startDate: string
  players: Map<string, ITournamentPlayer>
  currentMatches: string[]
}

const tournamentSchema = new Schema({
  name: String,
  startDate: String,
  players: {
    type: Map,
    of: tournamentPlayerSchema
  }
})

export const Tournament = model<ITournament>("Tournament", tournamentSchema)

export default Tournament
