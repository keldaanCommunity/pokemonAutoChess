import React from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import GamePokemonPortrait from "./game-pokemon-portrait"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { shopClick } from "../../../stores/NetworkStore"

export default function GameStore() {
  const dispatch = useAppDispatch()
  const shop = useAppSelector((state) => state.game.shop)
  const pokemonCollection = useAppSelector(
    (state) => state.game.pokemonCollection
  )
  // console.log(pokemonCollection);
  return (
    <ul className="game-pokemons-store">
      {shop.map((pokemon, index) => {
        if (pokemon != Pkm.DEFAULT) {
          const p = PokemonFactory.createPokemonFromName(pokemon)
          return (
            <GamePokemonPortrait
              key={'shop'+index}
              origin="shop"
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
              key={'shop'+index}
              origin="shop"
              index={index}
              pokemon={undefined}
              pokemonConfig={undefined}
              click={() => {}}
            />
          )
        }
      })}
    </ul>
  )
}
