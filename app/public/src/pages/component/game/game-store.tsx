import React, { useEffect, useState } from "react"
import { IDetailledPokemon } from "../../../../../models/mongo-models/bot-v2"
import PokemonFactory, { isSameFamily } from "../../../../../models/pokemon-factory"
import { Pkm, PkmFamily } from "../../../../../types/enum/Pokemon"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { shopClick } from "../../../stores/NetworkStore"
import { getGameScene } from "../../game"
import { playSound, SOUNDS } from "../../utils/audio"
import { LocalStoreKeys, localStore } from "../../utils/store"
import GamePokemonPortrait from "./game-pokemon-portrait"

export default function GameStore() {
  const dispatch = useAppDispatch()
  const shop = useAppSelector((state) => state.game.shop)
  const [teamPlanner, setTeamPlanner] = useState<IDetailledPokemon[]>(
    localStore.get(LocalStoreKeys.TEAM_PLANNER)
  )
  useEffect(() => {
    if (teamPlanner && !Array.isArray(teamPlanner)) {
      setTeamPlanner([]) // in case team planner local storage has been corrupted somehow (loading a wrong file for example)
    }
    const updateTeamPlanner = (e: StorageEvent) => {
      if (e.key === LocalStoreKeys.TEAM_PLANNER) {
        setTeamPlanner(localStore.get(LocalStoreKeys.TEAM_PLANNER))
      }
    }
    window.addEventListener("storage", updateTeamPlanner)
    return () => {
      window.removeEventListener("storage", updateTeamPlanner)
    }
  }, [])

  const scene = getGameScene()

  return (
    <ul className="game-pokemons-store">
      {shop.map((pokemon, index) => {
        if (pokemon != Pkm.DEFAULT) {
          return (
            <GamePokemonPortrait
              key={"shop" + index}
              origin="shop"
              index={index}
              pokemon={pokemon}
              inPlanner={teamPlanner?.some((p) => isSameFamily(p.name, pokemon))}
              onMouseEnter={() => {
                if (scene) {
                  if (scene.pokemonHovered)
                    scene.clearHovered(scene.pokemonHovered)
                  scene.pokemonHovered = null
                  scene.shopIndexHovered = index
                }
              }}
              onMouseLeave={() => {
                if (scene) scene.shopIndexHovered = null
              }}
              click={(e) => {
                playSound(SOUNDS.BUTTON_CLICK)
                dispatch(shopClick(index))
                if (scene) scene.shopIndexHovered = null
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
            />
          )
        }
      })}
    </ul>
  )
}
