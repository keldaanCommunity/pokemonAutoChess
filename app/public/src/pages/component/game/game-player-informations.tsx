import React, { ReactElement } from "react"
import CSS from "csstype"
import { useAppSelector } from "../../../hooks"
import { TitleName } from "../../../../../types"
import GameMoney from "./game-money"
import GameLife from "./game-life"
import { getAvatarSrc } from "../../../utils"
import TimerBar from "./game-timer-bar"

const style: CSS.Properties = {
  position: "absolute",
  top: ".5%",
  left: "30%",
  display: "flex",
  justifyContent: "space-between",
  padding: "5px",
  minWidth: "40%",
  height: "8%",
  alignItems: "center",
  color: "white",
  borderRadius: "12px 12px 0 0"
}

export default function GamePlayerInformations() {
  const opponentName = useAppSelector(
    (state) => state.game.currentPlayerOpponentName
  )
  const opponentAvatar = useAppSelector(
    (state) => state.game.currentPlayerOpponentAvatar
  )
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

  let opponent: null | ReactElement = null
  const vs =
    opponentAvatar != "" && opponentName != "" ? (
      <p style={{ color: "white", fontSize: "1.3vw" }}>Vs</p>
    ) : null
  if (opponentName != "" && opponentAvatar != "") {
    opponent = (
      <div
        className="nes-container"
        style={{
          backgroundColor: "#54596b",
          padding: "5px",
          display: "flex",
          height: "100%"
        }}
      >
        <img src={getAvatarSrc(opponentAvatar)} />
        <p style={{ marginLeft: "5px", color: "white" }}>{opponentName}</p>
      </div>
    )
  }

  return (
    <>
      <div style={style} className="nes-container">
        <div style={{ width: "4vw", textAlign: "center" }}>
          <p style={{ margin: 0 }}>Stage {stageLevel}</p>
          <p style={{ margin: 0 }}>{roundTime}s</p>
        </div>
        <div
          className="nes-container"
          style={{
            backgroundColor: "#54596b",
            padding: ".001px",
            display: "flex",
            width: "5vw",
            height: "100%",
            backgroundImage: 'url("assets/ui/pokeball-bg.png")',
            backgroundSize: "cover"
          }}
        >
          <div
            style={{
              background: "#54596b",
              display: "flex",
              alignItems: "center",
              borderRadius: "7px",
              height: "100%",
              padding: "0 0.5em"
            }}
          >
            <span style={{ color: "white" }}>
                {boardSize}/{experienceManager.level}
            </span>
            <img
              style={{ width: "1vw", height: "1vw" }}
              src="assets/ui/pokeball.svg"
            />
          </div>
        </div>

        <GameMoney money={money} />
        <GameLife life={life} />
        <div
          className="nes-container"
          style={{
            backgroundColor: "#54596b",
            padding: "5px",
            display: "flex",
            minWidth: "15%",
            height: "100%",
            gap: "5px"
          }}
        >
          <img src={getAvatarSrc(avatar)} />
          <p style={{ margin: "0px", color: "#ffc107" }}>{TitleName[title]}</p>
          <p style={{ marginLeft: "5px", color: "white", textAlign: "center" }}>
            {name}
          </p>
        </div>
        {vs}
        {opponent}
      </div>
      <TimerBar />
    </>
  )
}
