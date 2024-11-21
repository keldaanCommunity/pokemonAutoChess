import React from "react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { useTranslation } from "react-i18next"
import { IPlayer } from "../../../../../types"
import { getAvatarSrc } from "../../../../../utils/avatar"
import { getGameScene } from "../../game"
import { cc } from "../../utils/jsx"
import "./game-player-loading.css"

export default function GamePlayerLoadingBar(props: { player: IPlayer }) {
  const { t } = useTranslation()
  const selfPlayerId = getGameScene()?.uid
  const loadingPercent = props.player.loadingProgress

  return (
    <div
      className={cc("game-player-loading", {
        self: selfPlayerId === props.player.id
      })}
    >
      <div
        className="game-player-loading-icon"
        style={{
          backgroundImage: `url('${getAvatarSrc(props.player.avatar)}')`
        }}
      >
        <CircularProgressbar
          value={loadingPercent}
          styles={buildStyles({
            // How long animation takes to go from one percentage to another, in seconds
            pathTransitionDuration: 0
          })}
        />
      </div>

      <p style={{ fontWeight: "500" }}>{props.player.name}</p>
      <p>
        {t("elo")}: <b>{props.player.elo}</b>
      </p>
    </div>
  )
}
