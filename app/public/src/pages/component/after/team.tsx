import { ArraySchema } from "@colyseus/schema"
import React from "react"
import { IPokemonRecord } from "../../../../../models/colyseus-models/game-record"
import { Item } from "../../../../../types/enum/Item"
import { Pkm } from "../../../../../types/enum/Pokemon"
import PokemonPortrait from "../pokemon-portrait"
import "./team.css"

export default function Team(props: {
  team: IPokemonRecord[] | ArraySchema<IPokemonRecord>
  setHoveredPokemon?: (p: Pkm) => void
  setItemHovered?: (i: Item) => void
}) {
  return (
    <ul className="player-team-pokemons">
      {props.team.map((p, index) => {
        return (
          <li key={index}>
            <PokemonPortrait
              avatar={p.avatar}
              onMouseOver={() => {
                props.setHoveredPokemon?.(p.name)
              }}
              data-tooltip-id="pokemon-detail"
            />
            <div className="pokemon-items">
              {p.items.map((item, i) => (
                <img
                  key={i}
                  src={"/assets/item/" + item + ".png"}
                  data-tooltip-id="item-detail"
                  onMouseOver={() => props.setItemHovered?.(item)}
                />
              ))}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
