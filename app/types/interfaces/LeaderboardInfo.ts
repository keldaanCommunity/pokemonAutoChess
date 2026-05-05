export interface ILeaderboardInfo {
  id: string
  name: string
  avatar: string
  rank: number
  value: number
  twitchLogin?: string
  twitchDisplayName?: string
  youtubeChannelId?: string
  youtubeHandle?: string
  youtubeChannelTitle?: string
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
