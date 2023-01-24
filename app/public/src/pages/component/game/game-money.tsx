import React from "react"
import ReactTooltip from "react-tooltip"
import { Money } from "../icons/money"
import GameMoneyDetail from "./game-money-detail"

export default function GameMoney(props: { money: number }) {
  return (
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
        <Money value={props.money} />
      </div>
    </div>
  )
}
