import React from "react"
import { useTranslation } from "react-i18next"
import {
  ITournament,
  ITournamentPlayer
} from "../../../../../models/mongo-models/tournament"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { formatDate } from "../../utils/date"
import { participateInTournament } from "../../../stores/NetworkStore"
import { getAvatarSrc } from "../../../utils"
import { EloBadge } from "../profile/elo-badge"
import "./tournament-item.css"

export default function TournamentItem(props: { tournament: ITournament }) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const uid: string = useAppSelector((state) => state.network.uid)
  const participating = props.tournament.players.has(uid)
  const TIME_BEFORE_REGISTRATIONS_OPEN = 60 * 60 * 1000 // 1 hour
  const registrationsOpen =
    Date.now() >
    new Date(props.tournament.startDate).getTime() -
      TIME_BEFORE_REGISTRATIONS_OPEN

  return (
    <div className="tournament-item nes-container">
      <span className="tournament-name">{props.tournament.name}</span>
      <p>
        {t("starts_at")}{" "}
        {formatDate(new Date(props.tournament.startDate), {
          dateStyle: "long"
        })}
      </p>
      <div className="actions">
        {participating ? (
          <button
            className="participate-btn bubbly green"
            title={t("cancel_tournament_participation")}
            disabled={!registrationsOpen}
            onClick={() => {
              dispatch(
                participateInTournament({
                  tournamentId: props.tournament.id,
                  participate: false
                })
              )
            }}
          >
            {t("participating")}
          </button>
        ) : (
          <button
            className="participate-btn bubbly blue"
            title={t("register_tournament_participation")}
            disabled={!registrationsOpen}
            onClick={() => {
              dispatch(
                participateInTournament({
                  tournamentId: props.tournament.id,
                  participate: true
                })
              )
            }}
          >
            {t("participate")}
          </button>
        )}
      </div>
      {registrationsOpen && (
        <div className="participants">
          <p>
            {t("participants")} ({props.tournament.players.size})
          </p>
          <ul>
            {[...props.tournament.players.values()].map((p) => (
              <TournamentPlayer player={p} />
            ))}
          </ul>
        </div>
      )}
      {!registrationsOpen && <p>{t("registrations_open_info")}</p>}
    </div>
  )
}

export function TournamentPlayer(props: { player: ITournamentPlayer }) {
  return (
    <div
      className="player-box"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <img
        src={getAvatarSrc(props.player.avatar)}
        className="pokemon-portrait"
      />
      <span
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          padding: "0 0.5em"
        }}
      >
        {props.player.name}
      </span>
      <EloBadge elo={props.player.elo} />
    </div>
  )
}
