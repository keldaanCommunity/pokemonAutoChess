export interface IGameActivityDay {
  date: string // "YYYY-MM-DD"
  gameCount: number
}

export interface IGameActivity {
  updatedAt: string // ISO timestamp
  days: IGameActivityDay[] // last ~30 days, ascending
}
