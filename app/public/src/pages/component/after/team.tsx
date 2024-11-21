import React from "react"
import { ArraySchema } from "@colyseus/schema"
import { IPokemonRecord } from "../../../../../models/colyseus-models/game-record"
import { getAvatarSrc } from "../../../../../utils/avatar"
import "./team.css"

export default function Team(props: { team: IPokemonRecord[] | ArraySchema<IPokemonRecord> }) {
  return (
    <ul className="player-team-pokemons">
      {props.team.map((p, index) => {
        return (
          <li key={index}>
            <img src={getAvatarSrc(p.avatar)} className="pokemon-portrait" />
            <div className="pokemon-items">
              {p.items.map((item, i) => (
                <img key={i} src={"/assets/item/" + item + ".png"} />
              ))}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
