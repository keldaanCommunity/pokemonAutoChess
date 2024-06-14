import React from "react"
import { ILeaderboardInfo } from "../../../../../types/interfaces/LeaderboardInfo"
import { useAppSelector } from "../../../hooks"
import Leaderboard from "./leaderboard"

export default function BotLeaderboard() {
  const infos: ILeaderboardInfo[] = useAppSelector(
    (state) => state.lobby.botLeaderboard
  )
  return <Leaderboard isBot={true} infos={infos} noElo={false} />
}
