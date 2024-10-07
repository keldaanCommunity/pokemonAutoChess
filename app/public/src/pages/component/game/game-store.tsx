import React, { useEffect, useState } from "react"
import { IDetailledPokemon } from "../../../../../models/mongo-models/bot-v2"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { shopClick } from "../../../stores/NetworkStore"
import { getGameScene } from "../../game"
import { SOUNDS, playSound } from "../../utils/audio"
import { localStore, LocalStoreKeys } from "../../utils/store"
import GamePokemonPortrait from "./game-pokemon-portrait"

export default function GameStore() {
  const dispatch = useAppDispatch()
  const shop = useAppSelector((state) => state.game.shop)
  const [teamPlanner, setTeamPlanner] = useState<IDetailledPokemon[]>(localStore.get(LocalStoreKeys.TEAM_PLANNER))
  useEffect(() => {
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
              inPlanner={teamPlanner?.some(p => p.name === pokemon) ?? false}
              onMouseEnter={() => {
                if (scene) scene.shopIndexHovered = index
              }}
              onMouseLeave={() => {
                if (scene) scene.shopIndexHovered = null
              }}
              click={(e) => {
                playSound(SOUNDS.BUTTON_CLICK)
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
            />
          )
        }
      })}
    </ul>
  )
}
