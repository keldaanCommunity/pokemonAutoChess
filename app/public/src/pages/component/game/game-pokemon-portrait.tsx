import React, { useEffect, useMemo, useState } from "react"
import { Tooltip } from "react-tooltip"
import { CountEvolutionRule } from "../../../../../core/evolution-rules"
import { Pokemon } from "../../../../../models/colyseus-models/pokemon"
import { IPokemonConfig } from "../../../../../models/mongo-models/user-metadata"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { getPokemonData } from "../../../../../models/precomputed"
import { RarityColor } from "../../../../../types/Config"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { SpecialGameRule } from "../../../../../types/enum/SpecialGameRule"
import { useAppSelector } from "../../../hooks"
import { getPortraitSrc } from "../../../utils"
import { getGameScene } from "../../game"
import { Money } from "../icons/money"
import SynergyIcon from "../icons/synergy-icon"
import { GamePokemonDetail } from "./game-pokemon-detail"
import "./game-pokemon-portrait.css"

export default function GamePokemonPortrait(props: {
  index: number
  origin: string
  pokemon: Pokemon | Pkm | undefined
  click?: React.MouseEventHandler<HTMLDivElement>
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>
}) {
  if (!props.pokemon) {
    return <div className="game-pokemon-portrait my-box empty" />
  } else {
    const pokemon = useMemo(
      () =>
        typeof props.pokemon === "string"
          ? PokemonFactory.createPokemonFromName(props.pokemon)
          : props.pokemon!,
      [props.pokemon]
    )
    const rarityColor = RarityColor[pokemon.rarity]
    const pokemonCollection = useAppSelector(
      (state) => state.game.pokemonCollection
    )
    const pokemonConfig: IPokemonConfig | undefined = pokemonCollection.get(
      pokemon.index
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
          if (p.index === pokemon.index && p.evolution !== Pkm.DEFAULT) {
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

    let pokemonEvolution = pokemon.evolution
    const pokemonEvolution2 = getPokemonData(pokemonEvolution).evolution

    const willEvolve =
      pokemon.evolutionRule instanceof CountEvolutionRule &&
      count === pokemon.evolutionRule.numberRequired - 1

    const shouldShimmer =
      pokemon.evolutionRule instanceof CountEvolutionRule &&
      ((count > 0 && pokemonEvolution !== Pkm.DEFAULT) ||
        (countEvol > 0 && pokemonEvolution2 !== Pkm.DEFAULT))

    if (
      pokemon.evolutionRule instanceof CountEvolutionRule &&
      count === pokemon.evolutionRule.numberRequired - 1 &&
      countEvol === pokemon.evolutionRule.numberRequired - 1 &&
      pokemonEvolution2 != null
    )
      pokemonEvolution = pokemonEvolution2

    const pokemonInPortrait =
      willEvolve && pokemonEvolution
        ? PokemonFactory.createPokemonFromName(pokemonEvolution)
        : pokemon
    const pokemonInPortraitConfig = pokemonCollection.get(
      pokemonInPortrait.index
    )

    const specialGameRule = getGameScene()?.room?.state.specialGameRule
    let cost = PokemonFactory.getBuyPrice(pokemon.name, specialGameRule)
    
    if (
      willEvolve &&
      pokemonEvolution &&
      specialGameRule === SpecialGameRule.BUYER_FEVER
    ) {
      cost = 0
    }

    return (
      <div
        className={`my-box clickable game-pokemon-portrait ${
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
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        data-tooltip-id={`tooltip-${props.origin}-${props.index}`}
      >
        <Tooltip
          id={`tooltip-${props.origin}-${props.index}`}
          className="custom-theme-tooltip game-pokemon-detail-tooltip"
          place="top"
        >
          <GamePokemonDetail
            key={pokemonInPortrait.id}
            pokemon={pokemonInPortrait}
            emotion={pokemonInPortraitConfig?.selectedEmotion}
            shiny={pokemonInPortraitConfig?.selectedShiny}
          />
        </Tooltip>
        {willEvolve && pokemonEvolution && (
          <div className="game-pokemon-portrait-evolution">
            <img
              src={getPortraitSrc(
                pokemon.index,
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
            <Money value={cost} />
          </div>
        )}
        <ul className="game-pokemon-portrait-types">
          {Array.from(pokemon.types.values()).map((type) => {
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
