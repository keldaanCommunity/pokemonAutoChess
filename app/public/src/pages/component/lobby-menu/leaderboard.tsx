import React from "react"
import {
  ILeaderboardBotInfo,
  ILeaderboardInfo
} from "../../../../../types/interfaces/LeaderboardInfo"
import LeaderboardItem from "./leaderboard-item"

export default function Leaderboard(props: {
  isBot: boolean
  infos: ILeaderboardInfo[] | ILeaderboardBotInfo[]
  noElo: boolean | undefined
}) {
  return (
    <div style={{ display: "flex", flexFlow: "column", gap: "4px" }}>
      {props.infos.map(
        (i: ILeaderboardInfo | ILeaderboardBotInfo, index: number) => (
          <LeaderboardItem
            key={index}
            item={i}
            isBot={props.isBot}
            noElo={props.noElo}
          />
        )
      )}
    </div>
  )
}
