import React from "react"
import { ToastContainer } from "react-toastify"
import { useAppSelector } from "../../../hooks"
import { GameAdditionalPokemons } from "./game-additional-pokemons"
import GameExperience from "./game-experience"
import { GameLifeInfo } from "./game-life-info"
import GameLock from "./game-lock"
import { GameMoneyInfo } from "./game-money-info"
import GameRarityPercentage from "./game-rarity-percentage"
import GameRefresh from "./game-refresh"
import "./game-shop.css"
import GameStore from "./game-store"
import { GameTeamInfo } from "./game-team-info"

export default function GameShop() {
  useAppSelector((state) => state.game.money) // required for reactivity
  return (
    <>
      <div className="game-shop nes-container">
        <GameMoneyInfo />
        <GameLifeInfo />
        <GameTeamInfo />
        <div className="nes-container game-shop-actions">
          <GameRarityPercentage />
          <GameLock />
          <GameRefresh />
        </div>
        <GameAdditionalPokemons />
        <GameStore />
        <GameExperience />
      </div>
      <ToastContainer
        className="toast"
        containerId="toast-money"
        enableMultiContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        limit={1}
        closeButton={false}
        style={{ left: `calc(var(--sidebar-width) + 17.5vw)`, bottom: `9vw` }}
      />
      <ToastContainer
        className="toast"
        containerId="toast-life"
        enableMultiContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        limit={1}
        closeButton={false}
        style={{ left: `calc(var(--sidebar-width) + 11.5vw)`, bottom: `9vw` }}
      />
    </>
  )
}
