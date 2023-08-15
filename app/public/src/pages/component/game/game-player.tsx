import React from "react"
import { Tooltip } from "react-tooltip"
import { CircularProgressbarWithChildren } from "react-circular-progressbar"

import GamePlayerDetail from "./game-player-detail"
import { IPlayer } from "../../../../../types"
import { useAppSelector } from "../../../hooks"
import { getAvatarSrc } from "../../../utils"
import { cc } from "../../utils/jsx"

import "react-circular-progressbar/dist/styles.css"
import "./game-player.css"

export default function GamePlayer(props: {
  player: IPlayer
  click: (id: string) => void
  index: number
}) {
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
        dead: props.player.life <= 0
      })}
      onClick={playerClick}
      data-tooltip-id={"detail-" + props.player.id}
    >
      <CircularProgressbarWithChildren value={props.player.life} />
      <div className="nes-container life-text">{props.player.life}</div>
      <Tooltip
        id={"detail-" + props.player.id}
        className="customeTheme"
        textColor="#000000"
        place="left"
        data-tooltip-offset={{ left: 30, bottom: props.index === 0 ? 50 : 0 }}
      >
        <GamePlayerDetail
          name={props.player.name}
          life={props.player.life}
          money={props.player.money}
          level={props.player.experienceManager.level}
          history={props.player.history}
          synergies={props.player.synergies}
        />
      </Tooltip>
    </div>
  )
}
