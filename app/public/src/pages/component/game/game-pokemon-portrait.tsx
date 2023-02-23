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
import { useAppSelector } from "../../../hooks"

export default function GamePokemonPortrait(props: {
  index: number,
  origin: string,
  pokemon: Pokemon | undefined
  pokemonConfig: IPokemonConfig | undefined
  click: React.MouseEventHandler<HTMLDivElement>
}) {
  if (!props.pokemon) {
    return (<div className="game-pokemon-portrait nes-container empty" />)
  } else {
    const rarityColor = RarityColor[props.pokemon.rarity]
    const boardManager = getGameScene()?.board
    
    const uid: string = useAppSelector((state) => state.network.uid)
    const currentPlayerId: string = useAppSelector(
      (state) => state.game.currentPlayerId
    )
    const isOnAnotherBoard = currentPlayerId !== uid

    let count = 0
    let countEvol = 0
    let pokemonEvolution = props.pokemon.evolution
    let pokemonEvolution2: Pkm | null = null

    if (boardManager && !isOnAnotherBoard) {
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
        data-for={`tooltip-${props.origin}-${props.index}`}
      >
        <ReactTooltip
          id={`tooltip-${props.origin}-${props.index}`}
          className="customeTheme game-pokemon-detail-tooltip"
          effect="solid"
          place="bottom"
        >
          <GamePokemonDetail pokemon={props.pokemon} pokemonConfig={props.pokemonConfig} />
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
          <Money value={PkmCost[props.pokemon.rarity]} />
        </div>
        <ul className="game-pokemon-portrait-types">
          {props.pokemon.types.map((type) => {
            return (
              <li key={type}>
                <SynergyIcon type={type} size="1.4vw" />
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}
