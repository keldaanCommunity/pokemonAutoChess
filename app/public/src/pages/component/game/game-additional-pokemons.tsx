import React from "react"
import { PkmIndex } from "../../../../../types/enum/Pokemon"
import { useAppSelector } from "../../../hooks"
import { getPortraitSrc } from "../../../utils"

export function GameAdditionalPokemons() {
  const additionalPokemons = useAppSelector(
    (state) => state.game.additionalPokemons
  )
  if (!additionalPokemons || additionalPokemons.length === 0) {
    return null
  } else {
    return (
      <div className="nes-container game-additional-pokemons">
        {additionalPokemons.map((p) => (
          <img key={p} src={getPortraitSrc(PkmIndex[p])} />
        ))}
      </div>
    )
  }
}
