import React from "react"
import { useTranslation } from "react-i18next"
import { ITournament } from "../../../../../models/mongo-models/tournament"
import { Role } from "../../../../../types"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { removeTournament } from "../../../stores/LobbyStore"
import { formatDate } from "../../utils/date"

export function TournamentItem(props: { tournament: ITournament }) {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const user = useAppSelector((state) => state.lobby.user)
  const role = user?.role

  return (
    <div className="nes-container tournament-item">
      {role && (role === Role.MODERATOR || role === Role.ADMIN) && (
        <button
          className="remove-btn bubbly red"
          onClick={() => dispatch(removeTournament(props.tournament))}
        >
          <p style={{ fontSize: "0.5em", margin: "0px" }}>X</p>
        </button>
      )}
      <p className="name">{props.tournament.name}</p>
      <p className="date">
        {formatDate(new Date(props.tournament.startDate).getTime())}
      </p>
    </div>
  )
}
