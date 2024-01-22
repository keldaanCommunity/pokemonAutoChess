import React, { useEffect, useState } from "react"
import { Tooltip } from "react-tooltip"
import { Pokemon } from "../../../../../models/colyseus-models/pokemon"
import { IPokemonConfig } from "../../../../../models/mongo-models/user-metadata"
import { RarityColor } from "../../../../../types/Config"
import { getPortraitSrc } from "../../../utils"
import { GamePokemonDetail } from "./game-pokemon-detail"
import SynergyIcon from "../icons/synergy-icon"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { Money } from "../icons/money"
import { useAppSelector } from "../../../hooks"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { CountEvolutionRule } from "../../../../../core/evolution-rules"
import "./game-pokemon-portrait.css"

export default function GamePokemonPortrait(props: {
  index: number
  origin: string
  pokemon: Pokemon | undefined
  click?: React.MouseEventHandler<HTMLDivElement>
}) {
  if (!props.pokemon) {
    return <div className="game-pokemon-portrait nes-container empty" />
  } else {
    const rarityColor = RarityColor[props.pokemon.rarity]
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
    const board = useAppSelector(
      (state) => state.game.players.find((p) => p.id === uid)?.board
    )
    const isOnAnotherBoard = currentPlayerId !== uid

    const [count, setCount] = useState(0)
    const [countEvol, setCountEvol] = useState(0)

    useEffect(() => {
      let _count = 0
      let _countEvol = 0
      if (board && board.forEach && !isOnAnotherBoard && props.pokemon) {
        board.forEach((p) => {
          if (p.index === props.pokemon!.index && p.evolution !== Pkm.DEFAULT) {
            _count++
          }
          if (
            pokemonEvolution !== Pkm.DEFAULT &&
            p.evolution !== Pkm.DEFAULT &&
            p.index === PkmIndex[pokemonEvolution]
          ) {
            _countEvol++
          }
        })
      }

      setCount(_count)
      setCountEvol(_countEvol)
    }, [board?.size, props.pokemon]) // recount where board size or pokemon on this shop cell changes

    let pokemonEvolution = props.pokemon.evolution
    const pokemonEvolution2 =
      PokemonFactory.createPokemonFromName(pokemonEvolution).evolution

    const willEvolve =
      props.pokemon.evolutionRule instanceof CountEvolutionRule &&
      count === props.pokemon.evolutionRule.numberRequired - 1

    const shouldShimmer =
      props.pokemon.evolutionRule instanceof CountEvolutionRule &&
      ((count > 0 && pokemonEvolution !== Pkm.DEFAULT) ||
        (countEvol > 0 && pokemonEvolution2 !== Pkm.DEFAULT))

    if (
      props.pokemon.evolutionRule instanceof CountEvolutionRule &&
      count === props.pokemon.evolutionRule.numberRequired - 1 &&
      countEvol === props.pokemon.evolutionRule.numberRequired - 1 &&
      pokemonEvolution2 != null
    )
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
          className="custom-theme-tooltip game-pokemon-detail-tooltip"
          place="top"
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
          {Array.from(props.pokemon.types.values()).map((type) => {
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
