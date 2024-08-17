import React from "react"
import { ILeaderboardInfo } from "../../../../../types/interfaces/LeaderboardInfo"
import { useAppSelector } from "../../../hooks"
import Leaderboard from "./leaderboard"

export default function LevelLeaderboard() {
  const infos: ILeaderboardInfo[] = useAppSelector(
    (state) => state.lobby.levelLeaderboard
  )
  return <Leaderboard isBot={false} infos={infos} noElo={true} />
}
