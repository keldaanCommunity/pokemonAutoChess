import React from "react"
import HistoryItem from "../../../../../models/colyseus-models/history-item"
import { BattleResult } from "../../../../../types/enum/Game"
import { ArraySchema } from "@colyseus/schema"
import { Life } from "../icons/life"
import { Money } from "../icons/money"
import { getAvatarSrc } from "../../../utils"

export default function GamePlayerDetail(props: {
  name: string
  life: number
  money: number
  history: ArraySchema<HistoryItem>
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "10px",
          alignItems: "center"
        }}
      >
        <h4>{props.name}</h4>
        <div className="nes-container">
          <Life value={props.life} />
        </div>
        <div className="nes-container">
          <Money value={props.money} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {props.history.map((record, i) => {
          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                flexFlow: "column"
              }}
            >
              <img
                style={{
                  border:
                    record.result == BattleResult.WIN
                      ? "4px solid #4aa52e"
                      : "4px solid #8c2022",
                  marginLeft: "6px",
                  borderRadius: "12px"
                }}
                src={getAvatarSrc(record.avatar)}
              />
              <p style={{}}>{record.name.slice(0, 4)}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
