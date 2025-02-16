import React from "react"
import { ArraySchema } from "@colyseus/schema"
import { IPokemonRecord } from "../../../../../models/colyseus-models/game-record"
import { getAvatarSrc } from "../../../../../utils/avatar"
import "./team.css"
import { cc } from "../../utils/jsx"
import { usePreferences } from "../../../preferences"
import PokemonPortrait from "../pokemon-portrait"

export default function Team(props: {
  team: IPokemonRecord[] | ArraySchema<IPokemonRecord>
}) {
  const [{ antialiasing }] = usePreferences()
  return (
    <ul className="player-team-pokemons">
      {props.team.map((p, index) => {
        return (
          <li key={index}>
            <PokemonPortrait avatar={p.avatar} />
            <div className="pokemon-items">
              {p.items.map((item, i) => (
                <img
                  key={i}
                  src={"/assets/item/" + item + ".png"}
                  className={cc({ pixelated: !antialiasing })}
                />
              ))}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
