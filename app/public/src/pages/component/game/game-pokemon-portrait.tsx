import React from "react"
import { Tooltip } from "react-tooltip"
import { Pokemon } from "../../../../../models/colyseus-models/pokemon"
import { IPokemonConfig } from "../../../../../models/mongo-models/user-metadata"
import { RarityColor } from "../../../../../types/Config"
import { getPortraitSrc } from "../../../utils"
import { GamePokemonDetail } from "./game-pokemon-detail"
import SynergyIcon from "../icons/synergy-icon"
import { getGameScene } from "../../game"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { Money } from "../icons/money"
import { useAppSelector } from "../../../hooks"
import "./game-pokemon-portrait.css"
import PokemonFactory from "../../../../../models/pokemon-factory"

export default function GamePokemonPortrait(props: {
  index: number
  origin: string
  pokemon: Pokemon | undefined
  click: React.MouseEventHandler<HTMLDivElement>
}) {
  if (!props.pokemon) {
    return <div className="game-pokemon-portrait nes-container empty" />
  } else {
    const rarityColor = RarityColor[props.pokemon.rarity]
    const boardManager = getGameScene()?.board
    const pokemonCollection = useAppSelector(
      (state) => state.game.pokemonCollection
    )
    const pokemonConfig: IPokemonConfig | undefined = pokemonCollection.get(
      props.pokemon.index
    )

    const uid: string = useAppSelector((state) => state.network.uid)
    const currentPlayerId: string = useAppSelector(
      (state) => state.game.currentPlayerId
    )
    const isOnAnotherBoard = currentPlayerId !== uid

    let count = 0
    let countEvol = 0
    let pokemonEvolution = props.pokemon.evolution
    let pokemonEvolution2 = Pkm.DEFAULT

    if (boardManager && !isOnAnotherBoard) {
      boardManager.pokemons.forEach((p) => {
        if (p.index === props.pokemon!.index && p.evolution !== Pkm.DEFAULT) {
          count++
        }
        if (
          pokemonEvolution !== Pkm.DEFAULT &&
          p.evolution !== Pkm.DEFAULT &&
          p.index === PkmIndex[pokemonEvolution]
        ) {
          pokemonEvolution2 = p.evolution
          countEvol++
        }
      })
    }

    const willEvolve = count === 2
    const shouldShimmer =
      (count > 0 && pokemonEvolution !== Pkm.DEFAULT) ||
      (countEvol > 0 && pokemonEvolution2 !== Pkm.DEFAULT)
    if (count === 2 && countEvol === 2 && pokemonEvolution2 != null)
      pokemonEvolution = pokemonEvolution2

    const pokemonInPortrait =
      willEvolve && pokemonEvolution
        ? PokemonFactory.createPokemonFromName(pokemonEvolution)
        : props.pokemon
    const pokemonInPortraitConfig = pokemonCollection.get(
      pokemonInPortrait.index
    )

    return (
      <div
        className={`nes-container game-pokemon-portrait ${
          shouldShimmer ? "shimmer" : ""
        }`}
        style={{
          backgroundColor: rarityColor,
          borderColor: rarityColor,
          backgroundImage: `url("${getPortraitSrc(
            pokemonInPortrait.index,
            pokemonInPortraitConfig?.selectedShiny,
            pokemonInPortraitConfig?.selectedEmotion
          )}")`
        }}
        onClick={props.click}
        data-tooltip-id={`tooltip-${props.origin}-${props.index}`}
      >
        <Tooltip
          id={`tooltip-${props.origin}-${props.index}`}
          className="customeTheme game-pokemon-detail-tooltip"
          place="bottom"
        >
          <GamePokemonDetail
            pokemon={pokemonInPortrait}
            emotion={pokemonInPortraitConfig?.selectedEmotion}
            shiny={pokemonInPortraitConfig?.selectedShiny}
          />
        </Tooltip>
        {willEvolve && pokemonEvolution && (
          <div className="game-pokemon-portrait-evolution">
            <img
              src={getPortraitSrc(
                props.pokemon.index,
                pokemonConfig?.selectedShiny,
                pokemonConfig?.selectedEmotion
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
        {props.origin === "shop" && (
          <div className="game-pokemon-portrait-cost">
            <Money value={PokemonFactory.getBuyPrice(props.pokemon.name)} />
          </div>
        )}
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
