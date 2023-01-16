import React from "react"
import { IPokemonRecord } from "../../../../../models/colyseus-models/game-record"
import { Synergy } from "../../../../../types/enum/Synergy"
import { getAvatarSrc } from "../../../utils"
import "./team.css"

export default function Team(props: { team: IPokemonRecord[], synergies: { name: Synergy, value: number }[] }) {
  return (
    <div className="player-team">
    <ul className="player-team-pokemons">
      {props.team.map((p, index) => {
        return (
          <li key={index}>
            <img src={getAvatarSrc(p.avatar)} className="pokemon-portrait" />
            <div className="pokemon-items">
            {p.items.map((item, i) => <img key={i} src={"/assets/item/" + item + ".png"} />)}
            </div>
          </li>
        )
      })}
    </ul>    
    </div>
  )
}
