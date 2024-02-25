import { RoomAvailable } from "colyseus.js"
import React from "react"
import { useTranslation } from "react-i18next"
import { IPreparationMetadata } from "../../../../../types"
import {
  EloRankThreshold,
  MAX_PLAYERS_PER_LOBBY
} from "../../../../../types/Config"
import { GameMode } from "../../../../../types/enum/Game"
import { useAppSelector } from "../../../hooks"
import { cc } from "../../utils/jsx"
import "./room-item.css"

export default function RoomItem(props: {
  room: RoomAvailable<IPreparationMetadata>
  click: (room: RoomAvailable<IPreparationMetadata>) => Promise<void>
}) {
  const { t } = useTranslation()
  const user = useAppSelector((state) => state.lobby.user)

  let canJoin = true,
    disabledReason: string | null = null
  if (props.room.clients >= MAX_PLAYERS_PER_LOBBY) {
    canJoin = false
    disabledReason = t("lobby_full")
  } else if (props.room.metadata?.gameStarted === true) {
    canJoin = false
    disabledReason = t("game_already_started")
  } else if (
    props.room.metadata?.minRank != null &&
    (user?.elo ?? 0) < EloRankThreshold[props.room.metadata?.minRank]
  ) {
    canJoin = false
    disabledReason = t("min_rank_not_reached")
  }

  return (
    <div className="room-item">
      <span className="room-name">{props.room.metadata?.name}</span>
      {props.room.metadata?.password && (
        <img
          alt={t("private")}
          title={t("password_protected")}
          className="lock icon"
          src="/assets/ui/lock.svg"
        />
      )}
      {props.room.metadata?.gameMode === GameMode.SCRIBBLE && (
        <img
          alt={t("smeargle_scribble")}
          title={t("smeargle_scribble_hint")}
          className="scribble icon"
          src="/assets/ui/scribble.png"
          style={{ borderRadius: "50%" }}
        />
      )}
      {props.room.metadata?.noElo &&
        props.room.metadata?.gameMode === GameMode.NORMAL && (
          <img
            alt={t("just_for_fun")}
            title={t("just_for_fun")}
            className="noelo icon"
            src="/assets/ui/noelo.png"
            style={{ borderRadius: "50%" }}
          />
        )}
      {props.room.metadata?.minRank && (
        <img
          alt={t("minimum_rank")}
          title={
            t("minimum_rank") +
            ": " +
            t("elorank." + props.room.metadata?.minRank)
          }
          className="rank icon"
          src={"/assets/ranks/" + props.room.metadata?.minRank + ".svg"}
        />
      )}
      <span>
        {props.room.clients}/{MAX_PLAYERS_PER_LOBBY}
      </span>
      <button
        title={disabledReason ?? t("join")}
        disabled={!canJoin}
        className={cc(
          "bubbly",
          props.room.metadata?.password ? "orange" : "green"
        )}
        onClick={() => {
          if (
            props.room.clients < MAX_PLAYERS_PER_LOBBY &&
            props.room.metadata?.gameStarted !== true
          ) {
            props.click(props.room)
          }
        }}
      >
        {t("join")}
      </button>
    </div>
  )
}
