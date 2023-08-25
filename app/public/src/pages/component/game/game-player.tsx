import React from "react"
import ReactTooltip from "react-tooltip"
import { CircularProgressbarWithChildren } from "react-circular-progressbar"

import GamePlayerDetail from "./game-player-detail"
import { IPlayer } from "../../../../../types"
import { useAppSelector } from "../../../hooks"
import { getAvatarSrc } from "../../../utils"
import { cc } from "../../utils/jsx"
import Synergies from "../../../../../models/colyseus-models/synergies"
import GameState from "../../../../../rooms/states/game-state"

import "react-circular-progressbar/dist/styles.css"
import "./game-player.css"

function getSynergiesFromNetworkPlayer(
  gameState: GameState | undefined,
  player: IPlayer
): Synergies {
  if (!gameState) {
    return player.synergies
  }
  const networkSynergies = gameState.players.get(player.id)?.synergies?.toJSON()
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
  const spectatedPlayerId = useAppSelector(
    (state) => state.game.currentPlayerId
  )
  const game = useAppSelector((state) => state.network.game)
  const selfPlayerId = useAppSelector((state) => state.network.uid)

  function playerClick() {
    props.click(props.player.id)
  }

  const synergies = getSynergiesFromNetworkPlayer(game?.state, props.player)

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
