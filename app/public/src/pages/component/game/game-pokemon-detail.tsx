import React from "react"
import { Pokemon } from "../../../../../models/colyseus-models/pokemon"
import { RarityColor } from "../../../../../types/Config"
import {
  AbilityName,
  AbilityDescription,
} from "../../../../../types/strings/Ability"
import { getPortraitSrc } from "../../../utils"
import SynergyIcon from "../icons/synergy-icon"

const pStyle = {
  margin: "0px",
}

const imgStyle = { width: "20px", height: "20px" }

const divStyle = { display: "flex", justifyContent: "center", gap: "5px" }

export function GamePokemonDetail(props: { pokemon: Pokemon }) {
  return (
    <div style={{ display: "flex", maxWidth: "15vw", gap: "5px" }}>
      <div
        style={{
          display: "flex",
          flexFlow: "column",
          alignItems: "start",
          justifyContent: "space-between",
          gap: "5px",
        }}
      >
        <img
          style={{ width: "80px", height: "80px" }}
          src={getPortraitSrc(
            props.pokemon.index,
            props.pokemon.shiny,
            props.pokemon.emotion
          )}
        />
        <div>
          {props.pokemon.types.map((type) => <SynergyIcon type={type} key={type} />)}
        </div>
        <p style={{ color: RarityColor[props.pokemon.rarity] }}>
          {props.pokemon.rarity}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexFlow: "column",
          gap: "5px",
        }}
      >
        <div style={divStyle}>
          <img style={imgStyle} src={"assets/icons/hp.png"} />
          <p style={pStyle}>{props.pokemon.hp}</p>
        </div>
        <div style={divStyle}>
          <img style={imgStyle} src={"assets/icons/atk.png"} />
          <p style={pStyle}>{props.pokemon.atk}</p>
        </div>
        <div style={divStyle}>
          <img style={imgStyle} src={"assets/icons/def.png"} />
          <p style={pStyle}>{props.pokemon.def}</p>
        </div>
        <div style={divStyle}>
          <img style={imgStyle} src={"assets/icons/speDef.png"} />
          <p style={pStyle}>{props.pokemon.speDef}</p>
        </div>
        <div style={divStyle}>
          <img style={imgStyle} src={"assets/icons/range.png"} />
          <p style={pStyle}>{props.pokemon.range}</p>
        </div>
        <div style={divStyle}>
          <img style={imgStyle} src={"assets/icons/mana.png"} />
          <p style={pStyle}>{props.pokemon.maxMana}</p>
        </div>
      </div>
      <div>
        <p style={pStyle}>{AbilityName[props.pokemon.skill].eng}</p>
        <p style={pStyle}>{AbilityDescription[props.pokemon.skill].eng}</p>
      </div>
    </div>
  )
}
