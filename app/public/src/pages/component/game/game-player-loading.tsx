import React from "react"
import { IPlayer } from "../../../../../types"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { getAvatarSrc } from "../../../utils"
import "./game-player-loading.css"
import { cc } from "../../utils/jsx"
import { getGameScene } from "../../game"

export default function GamePlayerLoadingBar(props: {
  player: IPlayer
}) {
  const selfPlayerId = getGameScene()?.uid
  const loadingPercent = props.player.loadingProgress

  return (
    <div className={cc('game-player-loading', {
      self: selfPlayerId === props.player.id
    })}>
      <div 
        className="game-player-loading-icon"
        style={{backgroundImage: `url('${getAvatarSrc(props.player.avatar)}')`}}
      >
        <CircularProgressbar
          value={loadingPercent} 
          styles={buildStyles({
            // How long animation takes to go from one percentage to another, in seconds
            pathTransitionDuration: 0
          })}
        />
      </div>
    
      <p>{props.player.name}</p>
      <p>ELO: {props.player.elo}</p>
    </div>
  )
}
