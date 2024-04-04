export interface ITournament {
  id: string
  name: string
  startDate: string
  players: Map<string, ITournamentPlayer>
  brackets: Map<string, ITournamentBracket>
}

export interface ITournamentPlayer {
  name: string
  avatar: string
  elo: number
  ranks: number[]
  eliminated: boolean
}

export interface ITournamentBracket {
  name: string
  playersId: string[]
}
