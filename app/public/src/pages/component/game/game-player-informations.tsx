import React, { ReactElement } from "react"
import { useAppSelector } from "../../../hooks"
import { TitleName } from "../../../../../types"
import { getAvatarSrc } from "../../../utils"
import TimerBar from "./game-timer-bar"
import ReactTooltip from "react-tooltip"
import { Life } from "../icons/life"
import { Money } from "../icons/money"
import GameMoneyDetail from "./game-money-detail"
import "./game-player-informations.css";

export default function GamePlayerInformations() {
  const experienceManager = useAppSelector(
    (state) => state.game.currentPlayerExperienceManager
  )
  const boardSize = useAppSelector((state) => state.game.currentPlayerBoardSize)
  const name = useAppSelector((state) => state.game.currentPlayerName)
  const title = useAppSelector((state) => state.game.currentPlayerTitle)
  const avatar = useAppSelector((state) => state.game.currentPlayerAvatar)
  const life = useAppSelector((state) => state.game.currentPlayerLife)
  const money = useAppSelector((state) => state.game.currentPlayerMoney)
  const stageLevel = useAppSelector((state) => state.game.stageLevel)
  const roundTime = useAppSelector((state) => state.game.roundTime)

  return (
    <>
      <div id="game-player-informations" className="nes-container">
        <div className="stage-information">
          <p>Stage {stageLevel}</p>
          <p>{roundTime}s</p>
        </div>
        <div className="nes-container team-size information">
          <div data-tip data-for="detail-team-size">
            <ReactTooltip
              id="detail-team-size"
              className="customeTheme"
              effect="solid"
              place="bottom"
            >
              <p className="help">
                Place up to <output>{experienceManager.level}</output> pokemons
                on your board.
              </p>
              <p className="help">Increase your team size by leveling up</p>
            </ReactTooltip>
            <span>
              {boardSize}/{experienceManager.level}
            </span>
            <img className="icon" src="assets/ui/pokeball.svg" />
          </div>
        </div>

        <div className="nes-container money information">
          <div data-tip data-for="detail-money">
            <ReactTooltip
              id="detail-money"
              className="customeTheme"
              effect="solid"
              place="bottom"
            >
              <GameMoneyDetail />
            </ReactTooltip>
            <Money value={money} />
          </div>
        </div>
        <div className="nes-container life information">
          <div><Life value={life} /></div>
        </div>
        <div className="nes-container player-information">
          <img src={getAvatarSrc(avatar)} />
          <p style={{ margin: "0px", color: "#ffc107" }}>{TitleName[title]}</p>
          <p style={{ marginLeft: "5px", color: "white", textAlign: "center" }}>{name}</p>
        </div>
      </div>
      <TimerBar />
    </>
  )
}
