import React from "react"
import { IGameRecord } from "../../../../../models/colyseus-models/game-record"
import Elo from "../elo"
import "./history.css"
import Team from "../after/team"
import { formatDate } from "../../utils/date"

export default function History(props: { history: IGameRecord[] }) {
  if (props.history) {
    return (
      <table className="game-history">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Team</th>
            <th>Date</th>
            <th>Elo</th>
          </tr>
        </thead>
        <tbody>
          {props.history.map((r) => (
          <tr key={r.time}>
            <Record record={r} />
          </tr>))}
        </tbody>        
      </table>
    )
  } else {
    return null
  }
}

export function Record(props: { record: IGameRecord }) {
  return (<>
    <td>Top {props.record.rank}</td>
    <td><Team team={props.record.pokemons}></Team></td>
    <td>{formatDate(props.record.time)}</td>
    <td><Elo elo={props.record.elo} /></td>
  </>)
}
