import React, { useState } from "react"
import GamePlayerLoading from "./game-player-loading"
import { useAppSelector } from "../../../hooks"
import { getGameScene } from "../../game"
import "./game-loading-screen.css"
import { Navigate } from "react-router"
import { useTranslation } from "react-i18next"

export default function GameLoadingScreen(props: { connectError: string }) {
  const { t } = useTranslation()
  const players = useAppSelector((state) => state.game.players)
  const currentPlayerId = useAppSelector((state) => state.network.uid)
  const progress = players.find(
    (p) => p.id === currentPlayerId
  )?.loadingProgress
  const statusMessage = getGameScene()?.loadingManager?.statusMessage
  const [toAuth, setToAuth] = useState<boolean>(false)

  if (toAuth) {
    return <Navigate to={"/"} />
  }

  return (
    <div className="game-loading-screen">
      <ul className="game-players-loading">
        {players.map((p, i) => {
          const x = (0.2 + (i % 4) * 0.2) * 100
          const y = (i < 4 ? 0.2 : 0.8) * 100
          return (
            <li
              style={{ position: "absolute", top: `${y}%`, left: `${x}%` }}
              key={"game-player-loading-" + p.id}
            >
              <GamePlayerLoading player={p} />
            </li>
          )
        })}
      </ul>
      <div className="loading-bar">
        <progress
          className="nes-progress"
          value={progress}
          max="100"
        ></progress>
        <p id="status-message">{statusMessage}</p>
        {props.connectError && (
          <>
            <p className="error">{props.connectError}</p>
            <button onClick={() => setToAuth(true)} className="bubbly blue">
              {t("back_to_lobby")}
            </button>
          </>
        )}
      </div>
      <footer>{t("players_disconnected_hint")}</footer>
    </div>
  )
}
