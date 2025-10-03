import React from "react"
import { ArraySchema } from "@colyseus/schema"
import { IPokemonRecord } from "../../../../../models/colyseus-models/game-record"
import PokemonPortrait from "../pokemon-portrait"
import "./team.css"

export default function Team(props: {
  team: IPokemonRecord[] | ArraySchema<IPokemonRecord>
}) {
  return (
    <ul className="player-team-pokemons">
      {props.team.map((p, index) => {
        return (
          <li key={index}>
            <PokemonPortrait avatar={p.avatar} />
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
