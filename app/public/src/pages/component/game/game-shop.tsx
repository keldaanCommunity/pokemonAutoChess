import React from "react"
import { ToastContainer } from "react-toastify"
import { GameAdditionalPokemons } from "./game-additional-pokemons"
import GameExperience from "./game-experience"
import { GameLifeInfo } from "./game-life-info"
import GameLock from "./game-lock"
import { GameMoneyInfo } from "./game-money-info"
import GameRarityPercentage from "./game-rarity-percentage"
import GameRefresh from "./game-refresh"
import GameStore from "./game-store"
import { GameTeamInfo } from "./game-team-info"
import "./game-shop.css"

export default function GameShop() {
  return (
    <>
      <div className="game-shop my-container">
        <div id="game-shop-info">
          <GameMoneyInfo />
          <GameLifeInfo />
          <div className="spacer"></div>
          <GameAdditionalPokemons />
          <div className="spacer"></div>
          <GameTeamInfo />
        </div>
        <div className="game-shop-actions">
          <GameRarityPercentage />
          <GameLock />
          <GameRefresh />
        </div>
        <GameStore />
        <GameExperience />
      </div>
      <ToastContainer
        className="toast"
        containerId="toast-money"
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
