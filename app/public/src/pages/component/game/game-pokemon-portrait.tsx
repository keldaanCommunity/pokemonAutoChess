import React from "react"
import { Pokemon } from "../../../../../models/colyseus-models/pokemon"
import { IPokemonConfig } from "../../../../../models/mongo-models/user-metadata"
import { PkmCost, RarityColor } from "../../../../../types/Config"
import { getPortraitSrc } from "../../../utils"
import { GamePokemonDetail } from "./game-pokemon-detail"
import SynergyIcon from "../icons/synergy-icon"
import ReactTooltip from "react-tooltip"

export default function GamePokemonPortrait(props: {
  index: number
  pokemon: Pokemon | undefined
  pokemonConfig: IPokemonConfig | undefined
  click: React.MouseEventHandler<HTMLDivElement>
}) {
  if (!props.pokemon) {
    return (
      <div
        style={{
          width: "15%",
          marginRight: "1%",
          padding: "0px",
        }}
      />
    )
  } else {
    const rarityColor = RarityColor[props.pokemon.rarity]
    return (
      <div
        className="nes-container"
        style={{
          imageRendering: "pixelated",
          width: "15%",
          backgroundColor: rarityColor,
          borderColor: rarityColor,
          backgroundImage: `url("${getPortraitSrc(
            props.pokemon.index,
            props.pokemonConfig?.selectedShiny,
            props.pokemonConfig?.selectedEmotion
          )}")`,
          marginRight: "1%",
          padding: "0px",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          cursor: "var(--cursor-hover)",
        }}
        onClick={props.click}
        data-tip
        data-for={"shop-" + props.index}
      >
        <ReactTooltip
          id={"shop-" + props.index}
          className="customeTheme game-pokemon-detail-tooltip"
          effect="solid"
          place="bottom"
        >
          <GamePokemonDetail pokemon={props.pokemon} />
        </ReactTooltip>
        <div
          style={{
            position: "absolute",
            left: "5px",
            bottom: "5px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "1.2vw",
              textShadow: `
               -1px -1px 0 #fff,  
               1px -1px 0 #fff,
               -1px 1px 0 #fff,
                1px 1px 0 #fff`,
              margin: "0px",
            }}
          >
            {PkmCost[props.pokemon.rarity]}
          </p>
          <img
            style={{ width: "20px", height: "20px" }}
            src="/assets/ui/money.png"
          />
        </div>
        <ul
          style={{
            listStyleType: "none",
            padding: "0px",
            display: "flex",
            position: "absolute",
            justifyContent: "space-evenly",
            right: "0px",
            flexFlow: "column",
            top: "0px",
            height: "100%",
          }}
        >
          {props.pokemon.types.map((type) => {
            return (
              <li key={type}>
                <SynergyIcon type={type} />
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
