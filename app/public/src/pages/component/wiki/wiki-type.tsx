import React, { useState } from "react"
import ReactTooltip from "react-tooltip";
import PRECOMPUTED_TYPE_POKEMONS_ALL from "../../../../../models/precomputed/type-pokemons-all.json"
import {
  SynergyName,
  SynergyDetail
} from "../../../../../types/strings/Synergy"
import { EffectName } from "../../../../../types/strings/Effect"
import { TypeTrigger, RarityColor } from "../../../../../types/Config"
import { Synergy } from "../../../../../types/enum/Synergy"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../utils"
import SynergyIcon from "../icons/synergy-icon"
import { SynergyDescription } from "../synergy/synergy-description"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import PokemonFactory from "../../../../../models/pokemon-factory";
import { groupBy } from "../../../../../utils/array";
import { Pokemon } from "../../../../../models/colyseus-models/pokemon";
import { Rarity } from "../../../../../types/enum/Game";

export default function WikiType(props: { type: Synergy | "all" }) {
  const [hoveredPokemon, setHoveredPokemon] = useState<Pokemon>();
  const firstStagePokemons = (props.type === "all" ? Object.values(PRECOMPUTED_TYPE_POKEMONS_ALL).flat() : PRECOMPUTED_TYPE_POKEMONS_ALL[props.type])
    .map(p => PokemonFactory.createPokemonFromName(p))
    .filter(p => p.stars === 1 || p.rarity === Rarity.MYTHICAL)
  const pokemonsPerRarity = groupBy(firstStagePokemons, p => p.rarity)
  return (
    <div style={{padding: "1em"}}>
      {props.type !== "all" && <>
        <div style={{ display: "flex", marginBottom: "0.5em" }}>
          <SynergyIcon type={props.type} />
          <p>{SynergyName[props.type].eng}</p>
        </div>
        {SynergyDetail[props.type].map((effect, i) => {
          return (
            <div key={EffectName[effect]} style={{ display: "flex" }}>
              <p>
                ({TypeTrigger[props.type][i]}) {EffectName[effect]}:
              </p>
              <SynergyDescription effect={effect} />
            </div>
          )
        })}
      </>
      }
      <table>
        <tbody>
        {(Object.values(Rarity) as Rarity[]).map(rarity => {
          return <tr key={rarity}>
            <td style={{ color: RarityColor[rarity] }}>{rarity}</td>
            <td>{(pokemonsPerRarity[rarity] ?? []).map(p => {
              return <img key={p.name} src={getPortraitSrc(p.index)} alt={p.name} title={p.name}
                data-tip data-for="pokemon-detail"
                onMouseOver={() => {
                  setHoveredPokemon(p)
                }} />})}
            </td>
          </tr>
        })}
        </tbody>
      </table>
      {hoveredPokemon && <ReactTooltip
        id="pokemon-detail"
        className="customeTheme game-pokemon-detail-tooltip"
        effect="float"
        place="bottom"
        offset={{ bottom: 20 }}
      >
        <GamePokemonDetail pokemon={hoveredPokemon} />
      </ReactTooltip>}
    </div>
  )
}
