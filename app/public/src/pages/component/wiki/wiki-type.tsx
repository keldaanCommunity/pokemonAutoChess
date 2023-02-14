import React, { useState } from "react"
import ReactTooltip from "react-tooltip";
import PRECOMPUTED_TYPE_POKEMONS_ALL from "../../../../../models/precomputed/type-pokemons-all.json"
import {
  SynergyName,
  SynergyDetail
} from "../../../../../types/strings/Synergy"
import { EffectName } from "../../../../../types/strings/Effect"
import { TypeTrigger } from "../../../../../types/Config"
import { Synergy } from "../../../../../types/enum/Synergy"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../utils"
import SynergyIcon from "../icons/synergy-icon"
import { SynergyDescription } from "../synergy/synergy-description"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import PokemonFactory from "../../../../../models/pokemon-factory";
import { Pokemon } from "../../../../../models/colyseus-models/pokemon";

export default function WikiType(props: { type: Synergy }) {
  const [hoveredPokemon, setHoveredPokemon] = useState<Pokemon>();
  return (
    <div style={{padding: "1em"}}>
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
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {(PRECOMPUTED_TYPE_POKEMONS_ALL[props.type] as Pkm[]).map((p) => {
          return <img key={p} src={getPortraitSrc(PkmIndex[p])} alt={p} title={p}
          data-tip data-for="pokemon-detail"
          onMouseOver={() => { 
            setHoveredPokemon(PokemonFactory.createPokemonFromName(p)) 
          }} />
        })}
      </div>
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
