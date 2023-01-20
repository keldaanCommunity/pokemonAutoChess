import React from "react"
import ReactTooltip from "react-tooltip"
import { Money } from "../icons/money"
import GameMoneyDetail from "./game-money-detail"

export default function GameMoney(props: { money: number }) {
  return (
    <div
      className="nes-container"
      style={{
        backgroundColor: "#54596b",
        padding: ".001px",
        display: "flex",
        width: "100px",
        height: "100%",
        backgroundImage: 'url("assets/ui/money-bg.png"',
        backgroundSize: "cover"
      }}
    >
      <div
        style={{
          background: "#54596b",
          display: "flex",
          alignItems: "center",
          borderRadius: "7px",
          height: "100%"
        }}
        data-tip
        data-for={"detail-money"}
      >
        <ReactTooltip
          id={"detail-money"}
          className="customeTheme"
          effect="solid"
          place="bottom"
        >
          <GameMoneyDetail />
        </ReactTooltip>
        <Money value={props.money} />
      </div>
    </div>
  )
}
