import React, { useState } from "react"
import CSS from "csstype"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import GamePokemonPortrait from "./game-pokemon-portrait"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { pokemonPropositionClick } from "../../../stores/NetworkStore"
import { AdditionalPicksStages } from "../../../../../types/Config"

const style: CSS.Properties = {
  position: "absolute",
  top: "30%",
  left: "50%",
  transform: "translateX(-50%)"
}

export default function GamePokemonsPropositions() {
  const dispatch = useAppDispatch()
  const pokemonsProposition = useAppSelector((state) => state.game.pokemonsProposition)
  const pokemonCollection = useAppSelector((state) => state.game.pokemonCollection)
  const stageLevel =  useAppSelector((state) => state.game.stageLevel)

  const [visible, setVisible] = useState(true)
  if (pokemonsProposition.length > 0) {
    return (
      <div style={style}>
        <div className="nes-container" style={{visibility: visible ? 'visible' : 'hidden'}}>
          {AdditionalPicksStages.includes(stageLevel) && (<h2 style={{ textAlign: "center" }}>
            Pick an additional Pokemon. It will be available to everyone.
          </h2>)}
          <div
            style={{
              display: "flex",
              padding: "10px",
              gap: "1vw",
              justifyContent: "center"
            }}
          >
            {pokemonsProposition.map((pokemon, index) => {
              const p = PokemonFactory.createPokemonFromName(pokemon)
              return (
                <GamePokemonPortrait
                  key={'proposition'+index}
                  origin="proposition"
                  index={index}
                  pokemon={p}
                  pokemonConfig={pokemonCollection.get(p.index)}
                  click={(e) => {
                    dispatch(pokemonPropositionClick(p.name))
                  }}
                />
              )
            })}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", margin: "1em" }}>
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
