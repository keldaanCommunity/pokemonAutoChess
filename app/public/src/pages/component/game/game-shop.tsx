import React from "react"
import { ToastContainer } from "react-toastify"
import GameRefresh from "./game-refresh"
import GameLock from "./game-lock"
import GameExperience from "./game-experience"
import GameStore from "./game-store"
import { useAppSelector } from "../../../hooks"
import GameRarityPercentage from "./game-rarity-percentage"
import { GameAdditionalPokemons } from "./game-additional-pokemons"
import { GameMoneyInfo } from "./game-money-info"
import { GameLifeInfo } from "./game-life-info"
import { GameTeamInfo } from "./game-team-info"
import "./game-shop.css"

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
        style={{ left: `calc(80px + 17.5vw)`, bottom: `9vw` }}
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
        style={{ left: `calc(80px + 11.5vw)`, bottom: `9vw` }}
      />
    </>
  )
}
