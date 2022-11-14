import React from "react"
import LeaderboardItem from "./leaderboard-item"
import { ILeaderboardInfo } from "../../../../../models/colyseus-models/leaderboard-info"

export default function Leaderboard(props: {
  isBot: boolean
  infos: ILeaderboardInfo[]
  noElo: boolean | undefined
}) {
  return (
    <div>
      <div style={{ display: "flex", flexFlow: "column", gap: "10px" }}>
        {props.infos.map((i: ILeaderboardInfo, index: number) => (
          <LeaderboardItem
            key={index}
            item={i}
            isBot={props.isBot}
            noElo={props.noElo}
          />
        ))}
      </div>
    </div>
  )
}
