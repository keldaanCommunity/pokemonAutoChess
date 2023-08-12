import React from "react"
import ReactTooltip from "react-tooltip"
import { CircularProgressbarWithChildren } from "react-circular-progressbar"
import { Room } from "colyseus.js"

import GamePlayerDetail from "./game-player-detail"
import GameState from "../../../../../rooms/states/game-state"
import Synergies from "../../../../../models/colyseus-models/synergies"
import { IPlayer } from "../../../../../types"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { setPlayer } from "../../../stores/GameStore"
import { getAvatarSrc } from "../../../utils"
import { cc } from "../../utils/jsx"

import "react-circular-progressbar/dist/styles.css"
import "./game-player.css"

function getSynergiesFromNetworkPlayer(
  game: Room<GameState> | undefined,
  player: IPlayer
): Synergies {
  const state = game?.serializer?.getState()
  const networkSynergies = state?.players?.get(player.id)?.synergies?.toJSON()
  if (networkSynergies) {
    return networkSynergies
  } else {
    return player.synergies
  }
}

export default function GamePlayer(props: {
  player: IPlayer
  click: (id: string) => void
  index: number
}) {
  const dispatch = useAppDispatch()
  const { game, spectatedPlayerId } = useAppSelector((state) => ({
    game: state.network.game,
    spectatedPlayerId: state.game.currentPlayerId
  }))

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

  const synergies = getSynergiesFromNetworkPlayer(game, props.player)

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
          synergies={synergies}
        />
      </ReactTooltip>
    </div>
  )
}
