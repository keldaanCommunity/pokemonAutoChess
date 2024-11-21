import React from "react"
import { useTranslation } from "react-i18next"
import { getRankLabel } from "../../../../../../app/types/strings/Strings"
import { computeElo } from "../../../../../core/elo"
import { Role } from "../../../../../types"
import { ExpPlace, SynergyTriggers } from "../../../../../types/Config"
import { Synergy } from "../../../../../types/enum/Synergy"
import { useAppSelector } from "../../../hooks"
import SynergyIcon from "../icons/synergy-icon"
import { Avatar } from "../profile/avatar"
import Team from "./team"
import "./after-menu.css"

export default function AfterMenu() {
  const { t } = useTranslation()
  const players = useAppSelector((state) => state.after.players)
    .slice()
    .sort((a, b) => a.rank - b.rank)

  const elligibleToXP = useAppSelector((state) => state.after.elligibleToXP)
  const elligibleToELO = useAppSelector((state) => state.after.elligibleToELO)
  const currentPlayerId: string = useAppSelector((state) => state.network.uid)
  const currentPlayer = players.find((p) => p.id === currentPlayerId)
  const playerRank = currentPlayer ? currentPlayer.rank : null
  const humans = players.filter((p) => p.role !== Role.BOT)
  const newElo = currentPlayer
    ? computeElo(currentPlayer, currentPlayer.rank, currentPlayer.elo, humans)
    : null
  const shouldShowElo = elligibleToELO && currentPlayer && newElo

  return (
    <div className="after-menu">
      <div className="my-container is-centered">
        {playerRank && (
          <>
            <div className="player-rank">
              {playerRank <= 3 && (
                <img src={`/assets/ui/rank${playerRank}.png`} alt="" />
              )}
              <span>{getRankLabel(playerRank)}</span>
            </div>
            <div className="player-gains">
              {shouldShowElo && (
                <p className="player-elo">
                  ELO {newElo} (
                  {(newElo >= currentPlayer.elo ? "+" : "-") +
                    Math.abs(newElo - currentPlayer.elo)}
                  )
                </p>
              )}
              {elligibleToXP && (
                <p className="player-exp">EXP + {ExpPlace[playerRank - 1]}</p>
              )}
            </div>
          </>
        )}

        <table>
          <thead>
            <tr>
              <th>{t("rank")}</th>
              <th>{t("player")}</th>
              <th>{t("stats")}</th>
              <th>{t("team")}</th>
              <th>{t("synergies")}</th>
            </tr>
          </thead>
          <tbody>
            {players.map((v) => {
              return (
                <tr key={v.id}>
                  <td>{v.rank}</td>
                  <td>
                    <Avatar
                      avatar={v.avatar}
                      name={v.name}
                      elo={v.elo}
                      title={v.title}
                      role={v.role}
                    />
                  </td>
                  <td>
                    <p title={t("total_money_earned")}><img src="assets/icons/money.svg" alt="$" style={{ width: "24px", height: "24px" }} /> {v.moneyEarned}</p>
                    <p title={t("total_player_damage_dealt")}><img src="assets/icons/ATK.png" alt="✊" style={{ width: "24px", height: "24px" }} />{v.playerDamageDealt}</p>
                    <p title={t("total_reroll_count")}><img src="assets/ui/refresh.svg" alt="↻" style={{ width: "24px", height: "24px" }} /> {v.rerollCount}</p>
                  </td>
                  <td>
                    <Team team={v.pokemons} />
                  </td>
                  <td>
                    <ul className="player-team-synergies">
                      {v.synergies.filter(isNotIncomplete).map((s) => (
                        <React.Fragment key={s.name}>
                          <SynergyIcon type={s.name} />
                          <span>{s.value}</span>
                        </React.Fragment>
                      ))}
                    </ul>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function isNotIncomplete(s: { name: Synergy; value: number }) {
  return s.value >= SynergyTriggers[s.name][0]
}
