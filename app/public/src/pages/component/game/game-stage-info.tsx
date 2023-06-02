import React from "react"
import { useAppSelector } from "../../../hooks"
import { TitleName } from "../../../../../types"
import { getAvatarSrc } from "../../../utils"
import TimerBar from "./game-timer-bar"
import ReactTooltip from "react-tooltip"
import {
  AdditionalPicksStages,
  CarouselStages,
  MythicalPicksStages,
  NeutralStage
} from "../../../../../types/Config"
import "./game-stage-info.css"

export default function GameStageInfo() {  
  const name = useAppSelector((state) => state.game.currentPlayerName)
  const title = useAppSelector((state) => state.game.currentPlayerTitle)
  const avatar = useAppSelector((state) => state.game.currentPlayerAvatar)
  
  const stageLevel = useAppSelector((state) => state.game.stageLevel)
  const roundTime = useAppSelector((state) => state.game.roundTime)

  return (
    <>
      <div id="game-stage-info" className="nes-container">
        <div className="stage-information" data-tip data-for="detail-stage">
          <ReactTooltip
            id="detail-stage"
            className="customeTheme"
            effect="solid"
            place="bottom"
          >
            <p>
              <span className="help">PVE Stages:</span>{" "}
              {NeutralStage.map((s) => s.turn).join(", ")}
            </p>
            <p>
              <span className="help">Carousel Stages:</span>{" "}
              {CarouselStages.join(", ")}
            </p>
            <p>
              <span className="help">Additional picks:</span> Stages{" "}
              {AdditionalPicksStages.join(" and ")}
            </p>
            <p>
              <span className="help">Mythical picks:</span> Stages{" "}
              {MythicalPicksStages.join(" and ")}
            </p>
          </ReactTooltip>
          <p>Stage {stageLevel}</p>
          <p>{roundTime}s</p>
        </div>        
               
        <div className="nes-container player-information">
          <img src={getAvatarSrc(avatar)} className="pokemon-portrait" />
          <p className="player-title" style={{ margin: "0px" }}>
            {TitleName[title]}
          </p>
          <p style={{ marginLeft: "5px", color: "white", textAlign: "center" }}>
            {name}
          </p>
        </div>
      </div>
      <TimerBar />      
    </>
  )
}
