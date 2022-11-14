import React from "react"
import CSS from "csstype"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import GamePokemonPortrait from "./game-pokemon-portrait"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { pokemonPropositionClick } from "../../../stores/NetworkStore"

const style: CSS.Properties = {
  position: "absolute",
  top: "30%",
  left: "20.5%",
  width: "60%"
}

export default function GamePokemonsPropositions() {
  const dispatch = useAppDispatch()
  const pokemonsProposition = useAppSelector(
    (state) => state.game.pokemonsProposition
  )
  const pokemonCollection = useAppSelector(
    (state) => state.game.pokemonCollection
  )
  if (pokemonsProposition.length > 0) {
    return (
      <div style={style} className="nes-container">
        <h2 style={{ textAlign: "center" }}>
          Pick an additional pokemon. It will be available to everyone.
        </h2>
        <div
          style={{
            display: "flex",
            padding: "10px",
            height: "17vh",
            justifyContent: "center"
          }}
        >
          {pokemonsProposition.map((pokemon, index) => {
            const p = PokemonFactory.createPokemonFromName(pokemon)
            return (
              <GamePokemonPortrait
                key={index}
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
    )
  } else {
    return null
  }
}
