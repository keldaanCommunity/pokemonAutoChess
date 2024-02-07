import React from "react"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { shopClick } from "../../../stores/NetworkStore"
import { getGameScene } from "../../game"
import GamePokemonPortrait from "./game-pokemon-portrait"

export default function GameStore() {
  const dispatch = useAppDispatch()
  const shop = useAppSelector((state) => state.game.shop)
  const scene = getGameScene()

  return (
    <ul className="game-pokemons-store">
      {shop.map((pokemon, index) => {
        if (pokemon != Pkm.DEFAULT) {
          const p = PokemonFactory.createPokemonFromName(pokemon)
          return (
            <GamePokemonPortrait
              key={"shop" + index}
              origin="shop"
              index={index}
              pokemon={p}
              onMouseEnter={() => {
                if (scene) scene.shopIndexHovered = index
              }}
              onMouseLeave={() => {
                if (scene) scene.shopIndexHovered = null
              }}
              click={(e) => {
                dispatch(shopClick(index))
              }}
            />
          )
        } else {
          return (
            <GamePokemonPortrait
              key={"shop" + index}
              origin="shop"
              index={index}
              pokemon={undefined}
              click={() => {}}
            />
          )
        }
      })}
    </ul>
  )
}
