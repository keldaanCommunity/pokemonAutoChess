import React from "react"
import { ILeaderboardBotInfo } from "../../../../../types/interfaces/LeaderboardInfo"
import { useAppSelector } from "../../../hooks"
import Leaderboard from "./leaderboard"

export default function BotLeaderboard() {
  const infos: ILeaderboardBotInfo[] = useAppSelector(
    (state) => state.lobby.botLeaderboard
  )
  return <Leaderboard isBot={true} infos={infos} noElo={false} />
}
