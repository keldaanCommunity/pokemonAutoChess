import React, { useMemo } from "react"
import HistoryItem from "../../../../../models/colyseus-models/history-item"
import { BattleResult } from "../../../../../types/enum/Game"
import Synergies from "../../../../../models/colyseus-models/synergies"
import { SynergyTriggers } from "../../../../../types/Config"
import { ArraySchema } from "@colyseus/schema"
import { Life } from "../icons/life"
import { Money } from "../icons/money"
import { getAvatarSrc } from "../../../utils"
import { t } from "i18next"

export default function GamePlayerDetail(props: {
  name: string
  life: number
  money: number
  level: number
  history: ArraySchema<HistoryItem>
  synergies: Synergies
}) {
  const synergyList = useMemo(
    () =>
      Object.entries(props.synergies)
        .filter(([syn, val]) => val >= SynergyTriggers[syn][0])
        .map(([syn]) => syn),
    [props.synergies]
  )

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "1em",
          alignItems: "center"
        }}
      >
        <span className="player-name">{props.name}</span>
        <span>
          {t("lvl")} {props.level}
        </span>
        <div className="nes-container">
          <Life value={props.life} />
        </div>
        <div className="nes-container">
          <Money value={props.money} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "start" }}>
        {props.history.map((record, i) => {
          return (
            <div
              key={`${record.name}${i}_game-player-detail`}
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
                    record.result === BattleResult.WIN
                      ? "4px solid #4aa52e"
                      : record.result === BattleResult.DRAW
                      ? "4px solid #cc6a28"
                      : "4px solid #8c2022",
                  marginLeft: "6px",
                  borderRadius: "12px"
                }}
                src={getAvatarSrc(record.avatar)}
              />
              <p>{record.name.slice(0, 4)}</p>
            </div>
          )
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "start" }}>
        {synergyList.map((synergy, i) => {
          return (
            <div
            key={`${synergy}${i}_game-player-detail`}
            style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                flexFlow: "column"
              }}
            >
              <img
                src={`assets/types/${synergy}.svg`}
                alt={synergy}
                title={synergy}
                className="synergy-icon"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
