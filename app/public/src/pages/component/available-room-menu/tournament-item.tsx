import React from "react"
import { useTranslation } from "react-i18next"
import { ITournament } from "../../../../../models/mongo-models/tournament"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { formatDate } from "../../utils/date"
import { participateInTournament } from "../../../stores/NetworkStore"
import "./tournament-item.css"

export default function TournamentItem(props: { tournament: ITournament }) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const uid: string = useAppSelector((state) => state.network.uid)
  const participating = props.tournament.registrations.includes(uid)

  return (
    <div className="tournament-item nes-container">
      <span className="tournament-name">{props.tournament.name}</span>
      <p>
        {t("starts_at")} {formatDate(new Date(props.tournament.startDate))}
      </p>
      <div className="actions">
        {participating ? (
          <button
            className="participate-btn bubbly green"
            onClick={() => {
              dispatch(
                participateInTournament({
                  id: props.tournament.id!,
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
            onClick={() => {
              dispatch(
                participateInTournament({
                  id: props.tournament.id!,
                  participate: true
                })
              )
            }}
          >
            {t("participate")}
          </button>
        )}
      </div>
    </div>
  )
}
