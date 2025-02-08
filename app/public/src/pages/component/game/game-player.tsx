import React from "react"
import { CircularProgressbarWithChildren } from "react-circular-progressbar"
import { Tooltip } from "react-tooltip"

import { IPlayer } from "../../../../../types"
import { useAppSelector } from "../../../hooks"
import { getAvatarSrc } from "../../../../../utils/avatar"
import { cc } from "../../utils/jsx"
import GamePlayerDetail from "./game-player-detail"

import "react-circular-progressbar/dist/styles.css"
import "./game-player.css"
import { usePreference } from "../../../preferences"

export default function GamePlayer(props: {
  player: IPlayer
  click: (id: string) => void
  index: number
}) {
  const [antialiasing] = usePreference("antialiasing")
  const spectatedPlayerId = useAppSelector(
    (state) => state.game.currentPlayerId
  )
  const selfPlayerId = useAppSelector((state) => state.network.uid)

  function playerClick() {
    props.click(props.player.id)
  }

  return (
    <div
      style={{
        top: `${1 + props.index * 12.5}%`,
        backgroundImage: `url('${getAvatarSrc(props.player.avatar)}')`
      }}
      className={cc("game-player", {
        spectated: spectatedPlayerId === props.player.id,
        self: selfPlayerId === props.player.id,
        dead: props.player.life <= 0,
        pixelated: !antialiasing
      })}
      onClick={playerClick}
      data-tooltip-id={"detail-" + props.player.id}
    >
      <CircularProgressbarWithChildren value={props.player.life} />
      <div className="my-container life-text">{props.player.life}</div>
      <Tooltip
        id={"detail-" + props.player.id}
        className="custom-theme-tooltip"
        place="left"
        data-tooltip-offset={{ left: 30, bottom: props.index === 0 ? 50 : 0 }}
      >
        <GamePlayerDetail player={props.player} />
      </Tooltip>
    </div>
  )
}
