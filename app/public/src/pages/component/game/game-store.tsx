import React from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import GamePokemonPortrait from "./game-pokemon-portrait"
import CSS from "csstype"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { shopClick } from "../../../stores/NetworkStore"

const style: CSS.Properties = {
  display: "flex",
  listStyleType: "none",
  gap: "5px",
  width: "47vw",
  margin: "0px",
  padding: "0px",
  justifyContent: "space-between"
}

export default function GameStore() {
  const dispatch = useAppDispatch()
  const shop = useAppSelector((state) => state.game.shop)
  const pokemonCollection = useAppSelector(
    (state) => state.game.pokemonCollection
  )
  // console.log(pokemonCollection);
  return (
    <ul style={style}>
      {shop.map((pokemon, index) => {
        if (pokemon != Pkm.DEFAULT) {
          const p = PokemonFactory.createPokemonFromName(pokemon)
          return (
            <GamePokemonPortrait
              key={index}
              index={index}
              pokemon={p}
              pokemonConfig={pokemonCollection.get(p.index)}
              click={(e) => {
                dispatch(shopClick(index))
              }}
            />
          )
        } else {
          return (
            <GamePokemonPortrait
              key={index}
              index={index}
              pokemon={undefined}
              pokemonConfig={undefined}
              click={(e) => {
                dispatch(shopClick(index))
              }}
            />
          )
        }
      })}
    </ul>
  )
}
