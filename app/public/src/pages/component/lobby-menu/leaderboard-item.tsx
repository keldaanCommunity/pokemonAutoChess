import React from "react"
import { ILeaderboardInfo } from "../../../../../models/colyseus-models/leaderboard-info"
import { useAppDispatch } from "../../../hooks"
import { setTabIndex } from "../../../stores/LobbyStore"
import { searchName } from "../../../stores/NetworkStore"
import Elo from "../elo"
import { getAvatarSrc } from "../../../utils"

export default function LeaderboardItem(props: {
  item: ILeaderboardInfo
  isBot: boolean
  noElo: boolean | undefined
}) {
  const dispatch = useAppDispatch()
  return (
    <div
      className="player-box clickable"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
      onClick={() => {
        if (!props.isBot) {
          dispatch(searchName(props.item.name))
          dispatch(setTabIndex(4))
        }
      }}
    >
      <div style={{ display: "flex", gap: "5px" }}>
        <span style={{lineHeight: "40px"}}>{props.item.rank}</span>
        <img src={getAvatarSrc(props.item.avatar)} />
      </div>
      <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", padding: "0 0.5em" }}>
        {props.item.name}
      </span>
      <div>
        {props.noElo ? props.item.value : <Elo elo={props.item.value} />}
      </div>
    </div>
  )
}
