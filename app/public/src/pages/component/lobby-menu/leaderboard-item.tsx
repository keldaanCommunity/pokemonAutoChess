import React from "react"
import {
  ILeaderboardBotInfo,
  ILeaderboardInfo
} from "../../../../../models/colyseus-models/leaderboard-info"
import { useAppDispatch } from "../../../hooks"
import { setTabIndex } from "../../../stores/LobbyStore"
import { searchName } from "../../../stores/NetworkStore"
import Elo from "../elo"
import { getAvatarSrc } from "../../../utils"
import { useTranslation } from "react-i18next"

export default function LeaderboardItem(props: {
  item: ILeaderboardInfo | ILeaderboardBotInfo
  isBot: boolean
  noElo: boolean | undefined
}) {
  const { t } = useTranslation()
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
        <span className="player-rank">{props.item.rank}</span>
        <img
          src={getAvatarSrc(props.item.avatar)}
          className="pokemon-portrait"
        />
      </div>
      <span
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          padding: "0 0.5em"
        }}
      >
        {props.isBot ? t(`pkm.${props.item.name}`) : props.item.name}
      </span>
      {props.isBot && (
        <span>
          {t("by")} @{(props.item as ILeaderboardBotInfo).author}
        </span>
      )}
      <div>
        {props.noElo ? props.item.value : <Elo elo={props.item.value} />}
      </div>
    </div>
  )
}
