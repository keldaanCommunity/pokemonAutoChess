import React from "react"
import { IGameRecord } from "../../../../../models/colyseus-models/game-record"
import Elo from "../elo"
import "./history.css"
import Team from "../after/team"
import { formatDate } from "../../utils/date"

export default function History(props: { history: IGameRecord[] }) {
  return (
    <article className="game-history-list">
      <h2>Game History</h2>
      {(!props.history || props.history.length === 0) && (
        <p>No history found</p>
      )}
      {props.history &&
        props.history.map((r) => (
          <div
            key={r.time}
            title={formatDate(r.time)}
            className="nes-container game-history"
          >
            <span>Top {r.rank}</span>
            <Elo elo={r.elo} />
            <Team team={r.pokemons}></Team>
          </div>
        ))}
    </article>
  )
}
