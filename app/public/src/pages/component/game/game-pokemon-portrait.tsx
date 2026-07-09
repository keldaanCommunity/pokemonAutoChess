import type Phaser from "phaser"
import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { Tooltip } from "react-tooltip"
import { RarityColor } from "../../../../../config"
import { EvolutionManager } from "../../../../../core/evolution-logic/evolution-manager"
import type { Pokemon } from "../../../../../models/colyseus-models/pokemon"
import {
  getPkmWithCustom,
  type PokemonCustoms
} from "../../../../../models/colyseus-models/pokemon-customs"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { getBuyPrice } from "../../../../../models/shop"
import { EvolutionRuleType } from "../../../../../types/EvolutionRules"
import { type Pkm, PkmFamily } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { schemaValues } from "../../../../../utils/schemas"
import {
  selectConnectedPlayer,
  selectSpectatedPlayer,
  useAppSelector
} from "../../../hooks"
import { getGameScene } from "../../game"
import { cc } from "../../utils/jsx"
import { Money } from "../icons/money"
import SynergyIcon from "../icons/synergy-icon"
import { GamePokemonDetail } from "./game-pokemon-detail"
import "./game-pokemon-portrait.css"

// getBase64() is an expensive canvas readback and every portrait re-runs it on each state change, so cache
// by index. customs bake into the texture, which the TextureManager drops when its game is destroyed, so
// the cache registers a destroy listener on the game it reads from and clears itself with it
const portraitBase64Cache = new Map<string, string>()
let cacheSourceGame: Phaser.Game | null = null
export function getCachedPortrait(
  index: string,
  customs?: PokemonCustoms
): string {
  const cached = portraitBase64Cache.get(index)
  if (cached !== undefined) return cached
  // only read back a loaded texture: getBase64 returns "" for an absent key and the old `??` passed that
  // through as a broken url(""). an absent texture falls back to the portrait url and stays uncached, so a
  // later render caches the real base64 once the texture loads
  const scene = getGameScene()
  if (scene?.textures.exists(`portrait-${index}`)) {
    // tie the cache's lifetime to the game whose textures it mirrors
    if (cacheSourceGame !== scene.game) {
      cacheSourceGame = scene.game
      scene.game.events.once("destroy", clearPortraitBase64Cache)
    }
    const base64 = scene.textures.getBase64(`portrait-${index}`)
    portraitBase64Cache.set(index, base64)
    return base64
  }
  const pokemonCustom = getPkmWithCustom(index, customs)
  return getPortraitSrc(index, pokemonCustom.shiny, pokemonCustom.emotion)
}

// drop every cached portrait base64; fired by the source game's destroy event. also called on game entry
// because an abnormal exit (ROOM_DELETED / USER_BANNED) navigates away without destroying the game
export function clearPortraitBase64Cache() {
  portraitBase64Cache.clear()
  cacheSourceGame = null
}

export default function GamePokemonPortrait(props: {
  index: number
  origin: "wiki" | "shop" | "proposition" | "team" | "planner" | "battle"
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

  const currentPlayerUid: string = useAppSelector((state) => state.network.uid)
  const spectatedPlayerId: string = useAppSelector(
    (state) => state.game.playerIdSpectated
  )
  const spectatedPlayer = useAppSelector(selectSpectatedPlayer)
  const connectedPlayer = useAppSelector(selectConnectedPlayer)

  const board = connectedPlayer?.board ?? null

  const specialGameRule = useAppSelector((state) => state.game.specialGameRule)
  const stageLevel = useAppSelector((state) => state.game.stageLevel)

  const isOnAnotherBoard = spectatedPlayerId !== currentPlayerUid

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

  const customs = spectatedPlayer?.pokemonCustoms
  const pokemonCustom = getPkmWithCustom(pokemon.index, customs)
  const rarityColor = RarityColor[pokemon.rarity]

  const evolutionName = spectatedPlayer
    ? EvolutionManager.getEvolution(pokemon, spectatedPlayer)
    : (pokemon.evolutions[0] ?? pokemon.evolution)
  let pokemonEvolution = PokemonFactory.createPokemonFromName(evolutionName)

  const willEvolve =
    pokemon.evolutionRule.type === EvolutionRuleType.COUNT &&
    count === pokemon.evolutionRule.numberRequired - 1

  const shouldShimmer =
    pokemon.evolutionRule.type === EvolutionRuleType.COUNT &&
    ((count > 0 && pokemon.hasEvolution) ||
      (countEvol > 0 && pokemonEvolution.hasEvolution))

  if (
    pokemon.evolutionRule.type === EvolutionRuleType.COUNT &&
    count === pokemon.evolutionRule.numberRequired - 1 &&
    countEvol === pokemon.evolutionRule.numberRequired - 1 &&
    pokemonEvolution.hasEvolution
  ) {
    const evolutionName2 = spectatedPlayer
      ? EvolutionManager.getEvolution(
          pokemonEvolution,
          spectatedPlayer,
          stageLevel
        )
      : (pokemonEvolution.evolutions[0] ?? pokemonEvolution.evolution)
    pokemonEvolution = PokemonFactory.createPokemonFromName(evolutionName2)
  }

  const pokemonInPortrait =
    willEvolve && pokemonEvolution ? pokemonEvolution : pokemon

  const cost = getBuyPrice(pokemon.name, specialGameRule)

  const gainedSynergies =
    pokemonEvolution && willEvolve
      ? schemaValues(pokemonEvolution.types).filter(
          (type) => !pokemon.types.has(type)
        )
      : []
  const lostSynergies =
    pokemonEvolution && willEvolve
      ? schemaValues(pokemon.types).filter(
          (type) => !pokemonEvolution.types.has(type)
        )
      : []

  const canBuy = spectatedPlayer?.alive && spectatedPlayer?.money >= cost

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
          origin={props.origin}
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
