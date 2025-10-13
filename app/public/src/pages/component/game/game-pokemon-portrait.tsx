import React, { useEffect, useMemo, useState } from "react"
import { Tooltip } from "react-tooltip"
import { CountEvolutionRule } from "../../../../../core/evolution-rules"
import { Pokemon } from "../../../../../models/colyseus-models/pokemon"
import {
  getPkmWithCustom,
  PokemonCustoms
} from "../../../../../models/colyseus-models/pokemon-customs"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { getBuyPrice } from "../../../../../models/shop"
import { RarityColor } from "../../../../../types/Config"
import { Pkm, PkmFamily } from "../../../../../types/enum/Pokemon"
import { SpecialGameRule } from "../../../../../types/enum/SpecialGameRule"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { values } from "../../../../../utils/schemas"
import { selectCurrentPlayer, useAppSelector } from "../../../hooks"
import { getGameScene } from "../../game"
import { cc } from "../../utils/jsx"
import { Money } from "../icons/money"
import SynergyIcon from "../icons/synergy-icon"
import { GamePokemonDetail } from "./game-pokemon-detail"
import "./game-pokemon-portrait.css"

export function getCachedPortrait(
  index: string,
  customs?: PokemonCustoms
): string {
  const scene = getGameScene()
  const pokemonCustom = getPkmWithCustom(index, customs)
  return (
    scene?.textures.getBase64(`portrait-${index}`) ??
    getPortraitSrc(index, pokemonCustom.shiny, pokemonCustom.emotion)
  )
}

export default function GamePokemonPortrait(props: {
  index: number
  origin: string
  pokemon: Pokemon | Pkm | undefined
  click?: React.MouseEventHandler<HTMLDivElement>
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>
  inPlanner?: boolean
}) {
  const pokemon = useMemo(() => {
    if (typeof props.pokemon === "string") {
      const pokemon = PokemonFactory.createPokemonFromName(props.pokemon)
      pokemon.pp = pokemon.maxPP
      return pokemon
    }
    return props.pokemon
  }, [props.pokemon])

  const uid: string = useAppSelector((state) => state.network.uid)
  const currentPlayerId: string = useAppSelector(
    (state) => state.game.currentPlayerId
  )
  const currentPlayer = useAppSelector(selectCurrentPlayer)

  const board = useAppSelector(
    (state) => state.game.players.find((p) => p.id === uid)?.board
  )
  const specialGameRule = useAppSelector((state) => state.game.specialGameRule)
  const stageLevel = useAppSelector((state) => state.game.stageLevel)

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
      pokemon &&
      pokemon.hasEvolution
    ) {
      board.forEach((p) => {
        if (p.name === pokemon.name) {
          _count++
        } else if (PkmFamily[p.name] === pokemon.name) {
          _countEvol++
        }
      })
    }

    setCount(_count)
    setCountEvol(_countEvol)
  }, [board, board?.size, props.pokemon, pokemon, isOnAnotherBoard])

  if (!props.pokemon || !pokemon) {
    return <div className="game-pokemon-portrait my-box empty" />
  }

  const customs = currentPlayer?.pokemonCustoms
  const pokemonCustom = getPkmWithCustom(pokemon.index, customs)
  const rarityColor = RarityColor[pokemon.rarity]

  const evolutionName = currentPlayer
    ? pokemon.evolutionRule.getEvolution(pokemon, currentPlayer)
    : (pokemon.evolutions[0] ?? pokemon.evolution)
  let pokemonEvolution = PokemonFactory.createPokemonFromName(evolutionName)

  const willEvolve =
    pokemon.evolutionRule instanceof CountEvolutionRule &&
    count === pokemon.evolutionRule.numberRequired - 1

  const shouldShimmer =
    pokemon.evolutionRule instanceof CountEvolutionRule &&
    ((count > 0 && pokemon.hasEvolution) ||
      (countEvol > 0 && pokemonEvolution.hasEvolution))

  if (
    pokemon.evolutionRule instanceof CountEvolutionRule &&
    count === pokemon.evolutionRule.numberRequired - 1 &&
    countEvol === pokemon.evolutionRule.numberRequired - 1 &&
    pokemonEvolution.hasEvolution
  ) {
    const evolutionName2 = currentPlayer
      ? pokemonEvolution.evolutionRule.getEvolution(
          pokemonEvolution,
          currentPlayer,
          stageLevel
        )
      : (pokemonEvolution.evolutions[0] ?? pokemonEvolution.evolution)
    pokemonEvolution = PokemonFactory.createPokemonFromName(evolutionName2)
  }

  const pokemonInPortrait =
    willEvolve && pokemonEvolution ? pokemonEvolution : pokemon

  let cost = getBuyPrice(pokemon.name, specialGameRule)

  if (
    willEvolve &&
    pokemonEvolution &&
    specialGameRule === SpecialGameRule.BUYER_FEVER
  ) {
    cost = 0
  }

  const gainedSynergies =
    pokemonEvolution && willEvolve
      ? values(pokemonEvolution.types).filter(
          (type) => !pokemon.types.has(type)
        )
      : []
  const lostSynergies =
    pokemonEvolution && willEvolve
      ? values(pokemon.types).filter(
          (type) => !pokemonEvolution.types.has(type)
        )
      : []

  const canBuy = currentPlayer?.alive && currentPlayer?.money >= cost

  return (
    <div
      className={cc("my-box", "clickable", "game-pokemon-portrait", {
        shimmer: shouldShimmer,
        disabled: !canBuy && props.origin === "shop",
        planned: props.inPlanner ?? false
      })}
      style={{
        backgroundColor: rarityColor,
        borderColor: rarityColor,
        backgroundImage: `url("${getCachedPortrait(pokemonInPortrait.index, customs)}")`
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
          emotion={pokemonCustom.emotion}
          shiny={pokemonCustom.shiny}
        />
      </Tooltip>
      {willEvolve && pokemonEvolution && (
        <div className="game-pokemon-portrait-evolution">
          <img
            src={getCachedPortrait(pokemon.index, customs)}
            className="game-pokemon-portrait-evolution-portrait"
          />
          <img
            src="/assets/ui/evolution.png"
            alt=""
            className="game-pokemon-portrait-evolution-icon"
          />
        </div>
      )}
      {props.inPlanner && (!willEvolve || !pokemonEvolution) && (
        <img
          src="/assets/ui/planned.png"
          alt=""
          className="game-pokemon-portrait-planned-icon"
        />
      )}
      {props.origin === "shop" && (
        <div className="game-pokemon-portrait-cost">
          <Money value={cost} />
        </div>
      )}
      <ul className="game-pokemon-portrait-types">
        {Array.from(pokemonInPortrait.types.values()).map((type) => {
          return (
            <li
              key={type}
              className={cc({ gained: gainedSynergies.includes(type) })}
            >
              <SynergyIcon type={type} />
            </li>
          )
        })}
        {lostSynergies.map((type) => (
          <li key={type} className="lost">
            <SynergyIcon type={type} />
          </li>
        ))}
      </ul>
    </div>
  )
}
