import { RoomAvailable } from "colyseus.js"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { IPreparationMetadata, Role } from "../../../../../types"
import {
  EloRank,
  EloRankThreshold,
  MAX_PLAYERS_PER_GAME
} from "../../../../../types/Config"
import { GameMode } from "../../../../../types/enum/Game"
import { formatMinMaxRanks, getRank } from "../../../../../utils/elo"
import { useAppSelector } from "../../../hooks"
import { cc } from "../../utils/jsx"
import "./room-item.css"

export default function RoomItem(props: {
  room: RoomAvailable<IPreparationMetadata>
  click: (room: RoomAvailable<IPreparationMetadata>, action: string) => void
}) {
  const { t } = useTranslation()
  const user = useAppSelector((state) => state.network.profile)
  const isAdmin = user?.role === Role.ADMIN

  const nbPlayersExpected =
    props.room.metadata?.whitelist && props.room.metadata.whitelist.length > 0
      ? props.room.metadata?.whitelist.length
      : MAX_PLAYERS_PER_GAME

  let canJoin = true,
    disabledReason: string | null = null
  if (props.room.clients >= nbPlayersExpected) {
    canJoin = false
    disabledReason = t("game_full")
  } else if (props.room.metadata?.gameStartedAt != null) {
    canJoin = false
    disabledReason = t("game_already_started")
  } else if (
    props.room.metadata?.blacklist &&
    props.room.metadata.blacklist.length > 0 &&
    user?.uid &&
    props.room.metadata.blacklist.includes(user.uid) === true
  ) {
    canJoin = false
    disabledReason = t("blacklisted")
  } else if (
    props.room.metadata?.whitelist &&
    props.room.metadata.whitelist.length > 0 &&
    user?.uid &&
    props.room.metadata.whitelist.includes(user.uid) === false
  ) {
    canJoin = false
    disabledReason = t("not_whitelisted")
  } else if (
    props.room.metadata?.minRank != null &&
    (user?.elo ?? 0) < EloRankThreshold[props.room.metadata?.minRank]
  ) {
    canJoin = false
    disabledReason = t("min_rank_not_reached")
  } else if (
    props.room.metadata?.maxRank != null &&
    (user?.elo && EloRankThreshold[getRank(user.elo)] > EloRankThreshold[props.room.metadata?.maxRank])
  ) {
    canJoin = false
    disabledReason = t("max_rank_not_reached")
  }
  if (user?.role === Role.ADMIN) {
    canJoin = true
  }

  const title = `${props.room.metadata?.ownerName ? "Owner: " + props.room.metadata?.ownerName : ""}\n${props.room.metadata?.playersInfo?.join("\n")}`
  const [joining, setJoining] = useState<boolean>(false)

  return (
    <div className="room-item my-box">
      <span className="room-name" title={title}>
        {formatMinMaxRanks(props.room.metadata?.minRank as EloRank | null, props.room.metadata?.maxRank as EloRank | null) + " "}
        {props.room.metadata?.name}
      </span>
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
        />
      )}
      {props.room.metadata?.noElo &&
        props.room.metadata?.gameMode === GameMode.CUSTOM_LOBBY && (
          <img
            alt={t("no_elo")}
            title={t("no_elo")}
            className="noelo icon"
            src="/assets/ui/noelo.png"
          />
        )}
      {props.room.metadata?.gameMode === GameMode.QUICKPLAY && (
        <img
          alt={t("quick_play")}
          title={t("quick_play_hint")}
          className="quickplay icon"
          src="/assets/ui/quickplay.png"
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
        {props.room.clients}/{nbPlayersExpected}
      </span>
      {isAdmin && <button title="Delete room" onClick={() => { props.click(props.room, "delete") }}>X</button>}
      <button
        title={disabledReason ?? t("join")}
        disabled={!canJoin || joining}
        className={cc(
          "bubbly",
          joining ? "loading" : "",
          props.room.metadata?.password ? "orange" : "green"
        )}
        onClick={() => {
          if (canJoin && !joining) {
            props.click(props.room, "join")
            setJoining(true)
            setTimeout(() => setJoining(false), 5000)
          }
        }}
      >
        {t("join")}
      </button>
    </div >
  )
}
