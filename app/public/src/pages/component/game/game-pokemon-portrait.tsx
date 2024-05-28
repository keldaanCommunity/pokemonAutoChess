import React, { useEffect, useMemo, useState } from "react"
import { Tooltip } from "react-tooltip"
import { CountEvolutionRule } from "../../../../../core/evolution-rules"
import { Pokemon } from "../../../../../models/colyseus-models/pokemon"
import { IPokemonConfig } from "../../../../../models/mongo-models/user-metadata"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { getBuyPrice } from "../../../../../models/shop"
import { RarityColor } from "../../../../../types/Config"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { SpecialGameRule } from "../../../../../types/enum/SpecialGameRule"
import { useAppSelector } from "../../../hooks"
import { getPortraitSrc } from "../../../utils"
import { getGameScene } from "../../game"
import { cc } from "../../utils/jsx"
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
  const pokemon = useMemo(
    () =>
      typeof props.pokemon === "string"
        ? PokemonFactory.createPokemonFromName(props.pokemon)
        : props.pokemon,
    [props.pokemon]
  )

  const pokemonCollection = useAppSelector(
    (state) => state.game.pokemonCollection
  )

  const uid: string = useAppSelector((state) => state.network.uid)
  const currentPlayerId: string = useAppSelector(
    (state) => state.game.currentPlayerId
  )
  const currentPlayer = useAppSelector((state) =>
    state.game.players.find((p) => p.id === currentPlayerId)
  )

  const board = useAppSelector(
    (state) => state.game.players.find((p) => p.id === uid)?.board
  )
  const isOnAnotherBoard = currentPlayerId !== uid

  const [count, setCount] = useState(0)
  const [countEvol, setCountEvol] = useState(0)

  // recount where board size or pokemon on this shop cell changes
  useEffect(() => {
    let _count = 0
    let _countEvol = 0
    if (
      board &&
      board.forEach &&
      !isOnAnotherBoard &&
      props.pokemon &&
      pokemon
    ) {
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
  }, [board?.size, props.pokemon])

  if (!props.pokemon || !pokemon) {
    return <div className="game-pokemon-portrait my-box empty" />
  }

  const pokemonConfig: IPokemonConfig | undefined = pokemonCollection.get(
    pokemon.index
  )

  const rarityColor = RarityColor[pokemon.rarity]

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
  const pokemonInPortraitConfig = pokemonCollection.get(pokemonInPortrait.index)

  const specialGameRule = getGameScene()?.room?.state.specialGameRule
  let cost = getBuyPrice(pokemon.name, specialGameRule)

  if (
    willEvolve &&
    pokemonEvolution &&
    specialGameRule === SpecialGameRule.BUYER_FEVER
  ) {
    cost = 0
  }

  const canBuy = currentPlayer?.alive && currentPlayer?.money >= cost

  return (
    <div
      className={cc("my-box", "clickable", "game-pokemon-portrait", {
        shimmer: shouldShimmer,
        disabled: !canBuy && props.origin === "shop"
      })}
      style={{
        backgroundColor: rarityColor,
        borderColor: rarityColor,
        backgroundImage: `url("${getPortraitSrc(
          pokemonInPortrait.index,
          pokemonInPortraitConfig?.selectedShiny,
          pokemonInPortraitConfig?.selectedEmotion
        )}")`
      }}
      onClick={(e) => {
        if (canBuy && props.click) props.click(e)
      }}
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
              <SynergyIcon type={type} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
