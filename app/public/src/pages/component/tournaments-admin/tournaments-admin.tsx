import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import {
  createTournament,
  removeTournament
} from "../../../stores/NetworkStore"
import { ITournament } from "../../../../../models/mongo-models/tournament"
import { Role } from "../../../../../types"
import { formatDate } from "../../utils/date"
import "./tournament-admin.css"

export function TournamentsAdmin() {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [tournamentName, setTournamentName] = useState<string>("")
  const [tournamentDate, setTournamentDate] = useState<string>("")

  const tournaments = useAppSelector((state) => state.lobby.tournaments)
  const isLoading = !tournaments

  async function createNewTournament(event) {
    event.preventDefault()
    dispatch(
      createTournament({
        name: tournamentName,
        startDate: tournamentDate
      })
    )
  }

  return (
    <div className="nes-container tournaments-admin">
      <h1>Tournaments</h1>
      <div className="content">
        {isLoading && <p>Loading...</p>}
        {tournaments.length === 0 && <p>No tournaments planned</p>}
        {tournaments && (
          <ul>
            {tournaments.map((tournament) => (
              <li key={tournament.startDate}>
                <TournamentItem tournament={tournament} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="content nes-container">
        <h2>Create a new tournament</h2>
        <form className="tournament-form" onSubmit={createNewTournament}>
          <label>
            Tournament name{" "}
            <input
              type="text"
              required
              value={tournamentName}
              onChange={(event) => {
                setTournamentName(event.target.value)
              }}
            ></input>
          </label>
          <label>
            Start at{" "}
            <input
              type="datetime-local"
              required
              onChange={(event) => {
                if (event.target["validity"].valid) {
                  const d = new Date(event.target.value).toISOString()
                  setTournamentDate(d)
                }
              }}
            ></input>
          </label>
          <button type="submit" className="bubbly blue">
            Create tournament
          </button>
        </form>
      </div>
    </div>
  )
}

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
          onClick={() => {
            if (
              confirm("Cancel tournament ? All registrations will be deleted.")
            ) {
              dispatch(removeTournament({ id: props.tournament.id! }))
            }
          }}
        >
          <p style={{ fontSize: "0.5em", margin: "0px" }}>X</p>
        </button>
      )}
      <p className="name">{props.tournament.name}</p>
      <p className="date">{formatDate(new Date(props.tournament.startDate))}</p>
    </div>
  )
}
