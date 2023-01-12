import React from "react"
import ReactTooltip from "react-tooltip"
import GamePlayerDetail from "./game-player-detail"
import CSS from "csstype"
import { IPlayer } from "../../../../../types"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { setPlayer } from "../../../stores/GameStore"
import { CircularProgressbarWithChildren } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { getAvatarSrc } from "../../../utils"

export default function GamePlayer(props: {
  player: IPlayer
  click: (id: string) => void
  index: number
}) {
  const style: CSS.Properties = {
    cursor: "var(--cursor-hover)",
    height: "70px",
    width: "70px",
    position: "absolute",
    borderRadius: "100px",
    right: "0.5%",
    top: `${0.5 + props.index * 12.5}%`,
    backgroundImage: `url('${getAvatarSrc(props.player.avatar)}')`,
    backgroundSize: "cover",
    imageRendering: "pixelated"
  }
  const dispatch = useAppDispatch()
  const game = useAppSelector((state) => state.network.game)

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
      style={style}
      onClick={() => {
        playerClick()
      }}
      data-tip
      data-for={"detail-" + props.player.id}
    >
      <CircularProgressbarWithChildren
        value={props.player.life}
      ></CircularProgressbarWithChildren>
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
          history={props.player.history}
        />
      </ReactTooltip>
    </div>
  )
}
