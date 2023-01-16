import React from "react"
import { IGameRecord } from "../../../../../models/colyseus-models/game-record"
import Elo from "../elo"
import "./history.css"
import Team from "../after/team"
import { formatDate } from "../../utils/date"

export default function History(props: { history: IGameRecord[] }) {
  return (
    <article className="game-history">
      <p>Game History</p>
      {(!props.history || props.history.length === 0) && <p>No history found</p> }
      {props.history && props.history.length > 0 && (
      <table >
        <thead>
          <tr>
            <th>Rank</th>            
            <th>Date</th>
            <th>Elo</th>
            <th>Team</th>
          </tr>
        </thead>
        <tbody>
          {props.history.map((r) => (
          <tr key={r.time}>
            <Record record={r} />
          </tr>))}
        </tbody>        
      </table>)}
    </article>
  )
}

export function Record(props: { record: IGameRecord }) {
  return (<>
    <td>Top {props.record.rank}</td>
    <td>{formatDate(props.record.time)}</td>
    <td><Elo elo={props.record.elo} /></td>
    <td><Team team={props.record.pokemons}></Team></td>
  </>)
}
