import React from "react"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { getRankLabel } from "../../../../../../app/types/strings/Strings"
import { ExpPlace, SynergyTriggers } from "../../../../../config"
import { computeElo } from "../../../../../core/elo"
import { IAfterGamePlayer, Role } from "../../../../../types"
import { Synergy } from "../../../../../types/enum/Synergy"
import { ItemDetailTooltip } from "../../../game/components/item-detail"
import { useAppSelector } from "../../../hooks"
import { addIconsToDescription } from "../../utils/descriptions"
import { GamePokemonDetailTooltip } from "../game/game-pokemon-detail"
import { GameModeIcon } from "../icons/game-mode-icon"
import SynergyIcon from "../icons/synergy-icon"
import { Avatar } from "../profile/avatar"
import Team from "./team"
import "./after-menu.css"

export default function AfterMenu() {
  const { t } = useTranslation()
  const players = useAppSelector((state) => state.after.players)
    .slice()
    .sort((a, b) => a.rank - b.rank)

  const eligibleToXP = useAppSelector((state) => state.after.eligibleToXP)
  const eligibleToELO = useAppSelector((state) => state.after.eligibleToELO)
  const gameMode = useAppSelector((state) => state.after.gameMode)
  const currentPlayerId: string = useAppSelector((state) => state.network.uid)
  const currentPlayer = players.find((p) => p.id === currentPlayerId)
  const playerRank = currentPlayer ? currentPlayer.rank : null
  const humans = players.filter((p) => p.role !== Role.BOT)
  const newElo = currentPlayer
    ? computeElo(
        currentPlayer,
        currentPlayer.rank,
        currentPlayer.elo,
        humans,
        gameMode,
        false
      )
    : null
  const shouldShowElo = eligibleToELO && currentPlayer && newElo

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
            <p className="gamemode">
              <GameModeIcon gameMode={gameMode} />
              {t(`game_modes.${gameMode}`)}
            </p>
            <div className="player-gains">
              {shouldShowElo && (
                <p className="player-elo">
                  ELO {newElo} (
                  {(newElo >= currentPlayer.elo ? "+" : "-") +
                    Math.abs(newElo - currentPlayer.elo)}
                  )
                </p>
              )}
              {eligibleToXP && (
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
                    <img
                      src="assets/ui/battle.svg"
                      alt={t("stats")}
                      style={{
                        width: "28px",
                        height: "28px",
                        cursor: "var(--cursor-hover)"
                      }}
                      data-tooltip-id={`stats-tooltip-${v.id}`}
                    />
                    <Tooltip
                      id={`stats-tooltip-${v.id}`}
                      className="custom-theme-tooltip"
                      place="right"
                    >
                      <PlayerStatsTooltip player={v} />
                    </Tooltip>
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
      <GamePokemonDetailTooltip origin="after" />
      <ItemDetailTooltip />
    </div>
  )
}

function isNotIncomplete(s: { name: Synergy; value: number }) {
  return s.value >= SynergyTriggers[s.name][0]
}

function PlayerStatsTooltip({ player }: { player: IAfterGamePlayer }) {
  const { t } = useTranslation()
  const battleStats = [
    {
      icon: "assets/icons/money_total.svg",
      label: t("battle_stats.total_money_earned"),
      value: player.moneyEarned
    },
    {
      icon: "assets/icons/ATK.png",
      label: t("battle_stats.total_player_damage_dealt"),
      value: player.playerDamageDealt
    },
    {
      icon: "assets/ui/refresh.svg",
      label: t("battle_stats.total_reroll_count"),
      value: player.rerollCount
    },
    {
      icon: "assets/icons/HP.png",
      label: t("battle_stats.maxHP"),
      value: player.battleStats.maxHP
    },
    {
      icon: "assets/icons/ATK.png",
      label: t("battle_stats.maxAttack"),
      value: player.battleStats.maxAttack
    },
    {
      icon: "assets/icons/DEF.png",
      label: t("battle_stats.maxDefense"),
      value: player.battleStats.maxDefense
    },
    {
      icon: "assets/icons/SPE_DEF.png",
      label: t("battle_stats.maxSpecialDefense"),
      value: player.battleStats.maxSpecialDefense
    },
    {
      icon: "assets/icons/AP.png",
      label: t("battle_stats.maxAP"),
      value: player.battleStats.maxAP
    },
    {
      icon: "assets/icons/SPEED.png",
      label: t("battle_stats.maxSpeed"),
      value: player.battleStats.maxSpeed
    },
    {
      icon: "assets/icons/ATK.png",
      label: t("battle_stats.maxPhysicalDamage"),
      value: player.battleStats.maxPhysicalDamage
    },
    {
      icon: "assets/icons/AP.png",
      label: t("battle_stats.maxSpecialDamage"),
      value: player.battleStats.maxSpecialDamage
    },
    {
      icon: "assets/icons/CRIT_POWER.png",
      label: t("battle_stats.maxTrueDamage"),
      value: player.battleStats.maxTrueDamage
    },
    {
      icon: "assets/icons/SHIELD.png",
      label: t("battle_stats.maxShield"),
      value: player.battleStats.maxShield
    },
    {
      icon: "assets/icons/HP.png",
      label: t("battle_stats.maxHeal"),
      value: player.battleStats.maxHeal
    },
    {
      icon: "assets/ui/star.svg",
      label: t("battle_stats.maxWinStreak"),
      value: player.battleStats.maxWinStreak
    }
  ]

  return (
    <div className="player-stats-tooltip">
      <dl>
        {battleStats.map(({ icon, label, value }) => (
          <React.Fragment key={label}>
            <dt>
              <img src={icon} alt="" />
              {addIconsToDescription(label)}
            </dt>
            <dd>{value}</dd>
          </React.Fragment>
        ))}
      </dl>
    </div>
  )
}
