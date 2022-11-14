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
      className="playerBox my-cursor"
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
        {props.item.rank}
        <img src={getAvatarSrc(props.item.avatar)} />
      </div>
      <div
        style={{ overflow: "hidden", whiteSpace: "nowrap", maxWidth: "300px" }}
      >
        {props.item.name}
      </div>
      <div>
        {props.noElo ? props.item.value : <Elo elo={props.item.value} />}
      </div>
    </div>
  )
}
