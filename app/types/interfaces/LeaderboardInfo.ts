export interface ILeaderboardInfo {
  id: string
  name: string
  avatar: string
  rank: number
  value: number
}

export interface ILeaderboardBotInfo {
  name: string
  avatar: string
  rank: number
  value: number
  author: string
}

export interface ILeaderboardEventInfo extends ILeaderboardInfo {
  eventFinishTime: Date | null
}
