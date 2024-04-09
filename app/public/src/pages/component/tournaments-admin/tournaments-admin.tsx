import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import {
  createTournament,
  createTournamentLobbies,
  removeTournament
} from "../../../stores/NetworkStore"
import { formatDate } from "../../utils/date"
import { ITournament } from "../../../../../types/interfaces/Tournament"
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
    <div className="my-container tournaments-admin">
      <h1>Tournaments</h1>
      <div className="content">
        {isLoading && <p>Loading...</p>}
        {tournaments.length === 0 && <p>No tournaments planned</p>}
        {tournaments && (
          <ul>
            {tournaments.map((tournament) => (
              <li key={tournament.id}>
                <TournamentItem tournament={tournament} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="content my-box">
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

  return (
    <div className="my-box tournament-item">
      <button
        className="remove-btn bubbly red"
        onClick={() => {
          if (confirm("Delete tournament and all registrations ?")) {
            dispatch(removeTournament({ id: props.tournament.id! }))
          }
        }}
      >
        {t("delete")}
      </button>
      <button
        className="bubbly orange"
        onClick={() => {
          if (
            confirm(
              "Remake tournament lobbies ? Previous lobbies won't be deleted so do this only after a server reboot if lobbies have been lost"
            )
          ) {
            dispatch(createTournamentLobbies({ id: props.tournament.id! }))
          }
        }}
      >
        Remake lobbies
      </button>
      <p className="name">{props.tournament.name}</p>
      <p className="date">{formatDate(new Date(props.tournament.startDate))}</p>
    </div>
  )
}
