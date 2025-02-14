import React from "react"
import { useTranslation } from "react-i18next"
import {
  ILeaderboardBotInfo,
  ILeaderboardInfo
} from "../../../../../types/interfaces/LeaderboardInfo"
import { useAppDispatch } from "../../../hooks"
import { searchById } from "../../../stores/NetworkStore"
import { EloBadge } from "../profile/elo-badge"
import PokemonPortrait from "../pokemon-portrait"

export default function LeaderboardItem(props: {
  item: ILeaderboardInfo | ILeaderboardBotInfo
  isBot: boolean
  noElo: boolean | undefined
}) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  return (
    <div
      className="player my-box clickable"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
      onClick={() => {
        if (!props.isBot && "id" in props.item) {
          dispatch(searchById(props.item.id))
        }
      }}
    >
      <div style={{ display: "flex", gap: "5px" }}>
        <span className="player-rank">{props.item.rank}</span>
        <PokemonPortrait avatar={props.item.avatar} />
      </div>
      <span
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          padding: "0 0.5em"
        }}
      >
        {props.isBot ? (
          <>
            {t(`pkm.${props.item.name}`)} {t("by")} @
            {(props.item as ILeaderboardBotInfo).author}
          </>
        ) : (
          props.item.name
        )}
      </span>
      <div style={{ width: "8ch", textAlign: "end" }}>
        {props.noElo ? props.item.value : <EloBadge elo={props.item.value} />}
      </div>
    </div>
  )
}
