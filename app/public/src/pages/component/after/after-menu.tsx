import React from "react"
import { useAppSelector } from "../../../hooks"
import Avatar from "../avatar"
import Team from "./team"
import { getRankLabel } from "../../../../../../app/types/strings/Strings"
import "./after-menu.css";

export default function AfterMenu() {
  const players = useAppSelector((state) => state.after.players).slice().sort((a,b) => a.rank - b.rank)
  
  const currentPlayerId: string = useAppSelector( (state) => state.network.uid )
  const currentPlayer = players.find(p => p.id === currentPlayerId)
  console.log({ players, currentPlayerId })
  if(!currentPlayer) return null;
  const playerRank = currentPlayer!.rank;

  return (
    <div className="after-menu nes-container with-title is-centered">
      <div className="player-rank">
        {playerRank <= 3 && <img src={`/assets/ui/rank${playerRank}.png`} alt="" />}
        <span>{getRankLabel(playerRank)}</span>
      </div>
      <hr />
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Team</th>
          </tr>
        </thead>
        <tbody>
        {players.map((v) => {
          return (
            <tr key={v.id}>
              <td className="player-rank">{v.rank}</td>
              <td>                
                <Avatar
                  avatar={v.avatar}
                  name={v.name}
                  elo={undefined}
                  title={v.title}
                  role={v.role}
                />
              </td>
              <td>
                <Team team={v.pokemons} />
              </td>
            </tr>
          )
        })}
        </tbody>
      </table>
    </div>
  )
}