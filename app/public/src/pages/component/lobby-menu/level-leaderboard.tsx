import React from "react"
import { ILeaderboardInfo } from "../../../../../models/colyseus-models/leaderboard-info"
import { useAppSelector } from "../../../hooks"
import Leaderboard from "./leaderboard"

export default function LevelLeaderboard() {
  const infos: ILeaderboardInfo[] = useAppSelector(
    (state) => state.lobby.levelLeaderboard
  )
  return <Leaderboard isBot={false} infos={infos} noElo={true} />
}
