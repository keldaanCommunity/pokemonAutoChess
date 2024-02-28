import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { TournamentItem } from "./tournament-item"
import { useAppSelector } from "../../../hooks"
import { createTournament } from "../../../stores/NetworkStore"
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
