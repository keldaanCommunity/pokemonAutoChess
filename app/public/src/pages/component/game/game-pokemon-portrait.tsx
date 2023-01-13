import React from "react"
import { Pokemon } from "../../../../../models/colyseus-models/pokemon"
import { IPokemonConfig } from "../../../../../models/mongo-models/user-metadata"
import { PkmCost, RarityColor } from "../../../../../types/Config"
import { getPortraitSrc } from "../../../utils"
import { GamePokemonDetail } from "./game-pokemon-detail"
import SynergyIcon from "../icons/synergy-icon"
import ReactTooltip from "react-tooltip"
import { getGameScene } from "../../game"
import "./game-pokemon-portrait.css";

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
    const boardManager = getGameScene()?.board
    const willEvolve = boardManager && boardManager.getPossibleEvolution(props.pokemon.index)
    
    return (
      <div
        className={`nes-container game-pokemon-portrait ${willEvolve? "is-evolution": ""}`}
        style={{
          backgroundColor: rarityColor,
          borderColor: rarityColor,
          backgroundImage: `url("${getPortraitSrc(
            props.pokemon.index,
            props.pokemonConfig?.selectedShiny,
            props.pokemonConfig?.selectedEmotion
          )}")`
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
        <div className="game-pokemon-portrait-cost">
          <p>{PkmCost[props.pokemon.rarity]}</p>
          <img src="/assets/ui/money.png" alt="$" />
        </div>
        <ul className="game-pokemon-portrait-types">
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