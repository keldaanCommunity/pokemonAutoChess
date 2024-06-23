import { ArraySchema, MapSchema } from "@colyseus/schema"

export interface ITournament {
  id: string
  name: string
  startDate: string
  players: Map<string, ITournamentPlayer> | MapSchema<ITournamentPlayer>
  brackets: Map<string, ITournamentBracket> | MapSchema<ITournamentBracket>
  finished: boolean
}

export interface ITournamentPlayer {
  name: string
  avatar: string
  elo: number
  ranks: number[] | ArraySchema<number>
  eliminated: boolean
}

export interface ITournamentBracket {
  name: string
  playersId: string[] | ArraySchema<string>
  finished: boolean
}
