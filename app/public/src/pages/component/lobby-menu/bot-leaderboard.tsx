import React from "react"
import { ILeaderboardInfo } from "../../../../../models/colyseus-models/leaderboard-info"
import { useAppSelector } from "../../../hooks"
import Leaderboard from "./leaderboard"

export default function BotLeaderboard() {
  const infos: ILeaderboardInfo[] = useAppSelector(
    (state) => state.lobby.botLeaderboard
  )
  return <Leaderboard isBot={true} infos={infos} noElo={false} />
}
