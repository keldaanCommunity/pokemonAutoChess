import React, { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import GamePokemonPortrait from "./game-pokemon-portrait"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { pokemonPropositionClick } from "../../../stores/NetworkStore"
import { AdditionalPicksStages } from "../../../../../types/Config"
import { getGameScene } from "../../game"
import "./game-pokemon-propositions.css"

export default function GamePokemonsPropositions() {
  const dispatch = useAppDispatch()
  const pokemonsProposition = useAppSelector(
    (state) => state.game.pokemonsProposition
  )
  const pokemonCollection = useAppSelector(
    (state) => state.game.pokemonCollection
  )
  const stageLevel = useAppSelector((state) => state.game.stageLevel)

  const isBenchFull = getGameScene()?.board?.isBenchFull
  const life = useAppSelector((state) => state.game.currentPlayerLife)

  const [visible, setVisible] = useState(true)
  if (pokemonsProposition.length > 0 && life > 0) {
    return (
      <div className="game-pokemons-proposition">
        <div
          className="nes-container"
          style={{ visibility: visible ? "visible" : "hidden" }}
        >
          {AdditionalPicksStages.includes(stageLevel) && (
            <h2>
              Pick an additional Pokemon. It will be available to everyone.
            </h2>
          )}
          <div className="game-pokemons-proposition-list">
            {pokemonsProposition.map((pokemon, index) => {
              const p = PokemonFactory.createPokemonFromName(pokemon)
              return (
                <GamePokemonPortrait
                  key={"proposition" + index}
                  origin="proposition"
                  index={index}
                  pokemon={p}
                  click={(e) => {
                    dispatch(pokemonPropositionClick(p.name))
                  }}
                />
              )
            })}
          </div>
          {isBenchFull && (
            <p>You mush have a free slot on the bench, sell a Pokemon !</p>
          )}
        </div>

        <div className="show-hide-action">
          <button
            className="bubbly orange"
            onClick={() => {
              setVisible(!visible)
            }}
          >
            {visible ? "Hide" : "Show"}
          </button>
        </div>
      </div>
    )
  } else {
    return null
  }
}
