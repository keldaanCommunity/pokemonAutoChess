import React from "react"
import { ILeaderboardInfo } from "../../../../../types/interfaces/LeaderboardInfo"
import { useAppSelector } from "../../../hooks"
import Leaderboard from "./leaderboard"

export default function PlayerLeaderboard() {
  const infos: ILeaderboardInfo[] = useAppSelector(
    (state) => state.lobby.leaderboard
  )
  return <Leaderboard isBot={false} infos={infos} noElo={false} />
}
