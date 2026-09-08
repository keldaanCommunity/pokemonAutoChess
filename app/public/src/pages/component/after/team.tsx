import type { ArraySchema } from "@colyseus/schema"
import { getUnitScore } from "../../../../../core/unit-score"
import {
  type IPokemonRecord,
  pokemonFromRecord
} from "../../../../../models/colyseus-models/game-record"
import PokemonPortrait from "../pokemon-portrait"
import "./team.css"

export default function Team(props: {
  team: IPokemonRecord[] | ArraySchema<IPokemonRecord>
}) {
  const sortByStrongest = (a: IPokemonRecord, b: IPokemonRecord) =>
    getUnitScore(pokemonFromRecord(b)) - getUnitScore(pokemonFromRecord(a))
  return (
    <ul className="player-team-pokemons">
      {props.team.sort(sortByStrongest).map((p, index) => {
        return (
          <li key={index}>
            <PokemonPortrait
              avatar={p.avatar}
              data-tooltip-id="game-pokemon-detail-tooltip"
              data-tooltip-content={p.name}
            />
            <div className="pokemon-items">
              {p.items.map((item, i) => (
                <img
                  key={i}
                  src={"/assets/item/" + item + ".png"}
                  data-tooltip-id="item-detail-tooltip"
                  data-tooltip-content={item}
                />
              ))}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
