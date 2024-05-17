import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Navigate } from "react-router"
import { useAppSelector } from "../../../hooks"
import { getGameScene } from "../../game"
import GamePlayerLoading from "./game-player-loading"
import { shuffleArray } from "../../../../../utils/random"
import "./game-loading-screen.css"

export default function GameLoadingScreen(props: { connectError: string }) {
  const { t } = useTranslation()
  const players = useAppSelector((state) => state.game.players)
  const currentPlayerId = useAppSelector((state) => state.network.uid)
  const progress = players.find(
    (p) => p.id === currentPlayerId
  )?.loadingProgress
  const statusMessage = getGameScene()?.loadingManager?.statusMessage
  const [toAuth, setToAuth] = useState<boolean>(false)
  const [hint, setHint] = useState<string>("tab_out")  
  
  useEffect(() => {
    const loadingHints = [
      "tab_out",
      ...shuffleArray([
      "max_loading_time",
      "disconnection_time",
      "translation_project",
      "discord",
      "tipeee",
      "bug_report",
      "moderation",
      "berry_tree",
      "spriters",
      "wiki",
      "avatar"
      ])
    ]

    const interval = setInterval(() => {
        setHint(hint => loadingHints[(loadingHints.indexOf(hint)+1) % loadingHints.length]);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

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
          className="my-progress"
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
      <div className="loading-hint">
        <div className="speech-bubble">{t("loading_hints."+hint)}</div>
        <img src={"/assets/loading_hints/"+hint+".webp"} />
      </div>
    </div>
  )
}
