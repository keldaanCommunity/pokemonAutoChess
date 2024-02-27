import React from "react"
import { useTranslation } from "react-i18next"
import { ITournament } from "../../../../../models/mongo-models/tournament"
import { formatDate } from "../../utils/date"

export function TournamentItem(props: { tournament: ITournament }) {
  const { t } = useTranslation()

  return (
    <div className="nes-container tournament-item">
      <p className="name">{props.tournament.name}</p>
      <p className="date">
        {formatDate(new Date(props.tournament.startDate).getTime())}
      </p>
    </div>
  )
}
