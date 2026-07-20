import type { Pkm } from "../enum/Pokemon"

export interface ILeaderboardInfo {
  id: string
  name: string
  avatar: string
  rank: number
  value: number
  twitchLogin?: string
  twitchDisplayName?: string
}

export interface ILeaderboardBotInfo {
  name: Pkm
  avatar: string
  rank: number
  value: number
  author: string
}

export interface ILeaderboardEventInfo extends ILeaderboardInfo {
  eventFinishTime: Date | null
}
