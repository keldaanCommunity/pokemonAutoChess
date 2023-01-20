import React from "react"
import GameRefresh from "./game-refresh"
import GameLock from "./game-lock"
import GameExperience from "./game-experience"
import GameStore from "./game-store"
import { useAppSelector } from "../../../hooks"
import GameRarityPercentage from "./game-rarity-percentage"
import { GameAdditionalPokemons } from "./game-additional-pokemons"
import "./game-shop.css"

export default function GameShop() {
  useAppSelector((state) => state.game.money) // required for reactivity
  return (
    <div className="game-shop nes-container">
      <div className="nes-container game-shop-actions">
        <GameRarityPercentage />
        <GameLock />
        <GameRefresh />
      </div>
      <GameAdditionalPokemons />
      <GameStore />
      <GameExperience />
    </div>
  )
}
