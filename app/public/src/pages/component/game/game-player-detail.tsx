import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { IPlayer } from "../../../../../types"
import { SynergyTriggers } from "../../../../../types/Config"
import { BattleResult } from "../../../../../types/enum/Game"
import { getAvatarSrc } from "../../../../../utils/avatar"
import { Life } from "../icons/life"
import { Money } from "../icons/money"

export default function GamePlayerDetail(props: { player: IPlayer }) {
  const { t } = useTranslation()
  const synergyList = useMemo(
    () =>
      Object.entries(props.player.synergies)
        .filter(([syn, val]) => val >= SynergyTriggers[syn]?.[0])
        .map(([syn]) => syn),
    [props.player.synergies]
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
        <span className="player-name">{props.player.name}</span>
        <span>
          {t("lvl")} {props.player.experienceManager.level}
        </span>
        <span>
          <Life value={props.player.life} />
        </span>
        <span>
          <Money value={props.player.money} />
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "start" }}>
        {props.player.history.slice(-5).map((record, i) => {
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
              <p style={{ fontSize: "80%" }}>
                {(record.id === "pve" ? t(record.name) : record.name).slice(
                  0,
                  5
                )}
              </p>
            </div>
          )
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "start" }}>
        {synergyList.map((synergy, i) => {
          return (
            <div
              key={`${props.player.name}_${synergy}${i}_game-player-detail`}
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
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <span>{t("total")}</span>
        <span title={t("total_money_earned")}><img src="assets/icons/money_total.svg" alt="$" style={{ width: "24px", height: "24px" }} /> {props.player.totalMoneyEarned}</span>
        <span title={t("total_player_damage_dealt")}><img src="assets/icons/ATK.png" alt="✊" style={{ width: "24px", height: "24px" }} />{props.player.totalPlayerDamageDealt}</span>
        <span title={t("total_reroll_count")}><img src="assets/ui/refresh.svg" alt="↻" style={{ width: "24px", height: "24px" }} /> {props.player.rerollCount}</span>
      </div>
    </div>
  )
}
