import React from "react"
import { Pokemon } from "../../../../../models/colyseus-models/pokemon"
import { IPokemonConfig } from "../../../../../models/mongo-models/user-metadata"
import { PkmCost, RarityColor } from "../../../../../types/Config"
import { getPortraitSrc } from "../../../utils"
import { GamePokemonDetail } from "./game-pokemon-detail"
import SynergyIcon from "../icons/synergy-icon"
import ReactTooltip from "react-tooltip"
import { getGameScene } from "../../game"
import "./game-pokemon-portrait.css"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { Money } from "../icons/money"

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
          padding: "0px"
        }}
      />
    )
  } else {
    const rarityColor = RarityColor[props.pokemon.rarity]
    const boardManager = getGameScene()?.board

    let count = 0
    let countEvol = 0
    let pokemonEvolution = props.pokemon.evolution
    let pokemonEvolution2: Pkm | null = null

    if (boardManager) {
      boardManager.pokemons.forEach((p) => {
        if (p.index == props.pokemon!.index && p.evolution != Pkm.DEFAULT) {
          count++
        }
        if (
          p.index == PkmIndex[pokemonEvolution] &&
          p.evolution != Pkm.DEFAULT
        ) {
          pokemonEvolution2 = p.evolution
          countEvol++
        }
      })
    }

    const willEvolve = count === 2
    const shouldShimmer =
      (count > 0 && pokemonEvolution != null) ||
      (countEvol > 0 && pokemonEvolution2 != null)
    if (count === 2 && countEvol === 2 && pokemonEvolution2 != null)
      pokemonEvolution = pokemonEvolution2

    return (
      <div
        className={`nes-container game-pokemon-portrait ${
          shouldShimmer ? "shimmer" : ""
        }`}
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
        {willEvolve && pokemonEvolution && (
          <div className="game-pokemon-portrait-evolution">
            <img
              src={getPortraitSrc(
                PkmIndex[pokemonEvolution],
                props.pokemonConfig?.selectedShiny,
                props.pokemonConfig?.selectedEmotion
              )}
              className="game-pokemon-portrait-evolution-portrait"
            />
            <img
              src="/assets/ui/evolution.png"
              alt=""
              className="game-pokemon-portrait-evolution-icon"
            />
          </div>
        )}
        <div className="game-pokemon-portrait-cost">
          <p>{PkmCost[props.pokemon.rarity]}</p>
          <Money />
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
