import React from "react"
import ReactTooltip from "react-tooltip"
import GamePlayerDetail from "./game-player-detail"
import { IPlayer } from "../../../../../types"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { setPlayer } from "../../../stores/GameStore"
import { CircularProgressbarWithChildren } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { getAvatarSrc } from "../../../utils"
import "./game-player.css"
import { cc } from "../../utils/jsx"

export default function GamePlayer(props: {
  player: IPlayer
  click: (id: string) => void
  index: number
}) {
  const dispatch = useAppDispatch()
  const game = useAppSelector((state) => state.network.game)
  const spectatedPlayerId: string = useAppSelector(
    (state) => state.game.currentPlayerId
  )
  const selfPlayerId = useAppSelector((state) => state.network.uid)

  function playerClick() {
    props.click(props.player.id)
    if (game && game.state.players) {
      const player = game.state.players.get(props.player.id)
      if (player) {
        dispatch(setPlayer(player))
      }
    }
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
      data-tip
      data-for={"detail-" + props.player.id}
    >
      <CircularProgressbarWithChildren value={props.player.life} />
      <div className="nes-container life-text">{props.player.life}</div>
      <ReactTooltip
        id={"detail-" + props.player.id}
        className="customeTheme"
        textColor="#000000"
        effect="solid"
        place="left"
        offset={{ left: 30, bottom: props.index === 0 ? 50 : 0 }}
      >
        <GamePlayerDetail
          name={props.player.name}
          life={props.player.life}
          money={props.player.money}
          level={props.player.experienceManager.level}
          history={props.player.history}
        />
      </ReactTooltip>
    </div>
  )
}
