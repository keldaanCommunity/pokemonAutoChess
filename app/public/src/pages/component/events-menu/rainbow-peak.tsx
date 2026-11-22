import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import {
  RAINBOW_PEAK_MAX_EVENT_POINTS,
  SYNERGY_COLORS
} from "../../../../../config"
import {
  getRainbowPeakSynergyOrder,
  getRainbowPeakTargetSynergy
} from "../../../../../core/events/rainbow-peak"
import { Synergy } from "../../../../../types/enum/Synergy"
import type { ILeaderboardEventInfo } from "../../../../../types/interfaces/LeaderboardInfo"
import { clamp } from "../../../../../utils/number"
import { useAppSelector, useGameEventResetCountdown } from "../../../hooks"
import { searchById } from "../../../network"
import { setEventLeaderboard } from "../../../stores/LobbyStore"
import { formatDate, formatDuration } from "../../utils/date"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import SynergyIcon from "../icons/synergy-icon"
import PokemonPortrait from "../pokemon-portrait"
import "./rainbow-peak.css"

export function RainbowPeak() {
  const { t } = useTranslation()
  const profile = useAppSelector((state) => state.network.profile)
  const eventLeaderboard = useAppSelector(
    (state) => state.lobby.eventLeaderboard
  )

  useEffect(() => {
    function fetchEventLeaderboard() {
      fetch("/leaderboards/event")
        .then((res) => res.json())
        .then((data) => {
          setEventLeaderboard(data)
        })
    }
    fetchEventLeaderboard()
    const interval = setInterval(fetchEventLeaderboard, 60 * 1000 * 10)
    return () => clearInterval(interval)
  }, [])

  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [playerHovered, setPlayerHovered] =
    useState<ILeaderboardEventInfo | null>(null)

  const resetCountdown = useGameEventResetCountdown()

  const synergyOrder = useMemo(
    () => getRainbowPeakSynergyOrder(profile?.uid ?? ""),
    [profile?.uid]
  )

  const currentTarget = profile
    ? synergyOrder[clamp(profile.eventPoints, 0, RAINBOW_PEAK_MAX_EVENT_POINTS)]
    : undefined

  const players = useMemo(() => {
    const list = [...eventLeaderboard]
    if (profile && !list.some((player) => player.id === profile.uid)) {
      list.push({
        id: profile.uid,
        name: profile.displayName,
        avatar: profile.avatar,
        rank: 0,
        value: profile.eventPoints,
        eventFinishTime: profile.eventFinishTime,
        eventData: profile.eventData
      })
    }
    return list
  }, [eventLeaderboard, profile])

  const playersByStep = useMemo(() => {
    const map = new Map<number, ILeaderboardEventInfo[]>()
    players.forEach((player) => {
      const step = clamp(player.value, 0, RAINBOW_PEAK_MAX_EVENT_POINTS)
      const stepPlayers = map.get(step) ?? []
      stepPlayers.push(player)
      map.set(step, stepPlayers)
    })
    return map
  }, [players])

  const finishers = useMemo(
    () => playersByStep.get(RAINBOW_PEAK_MAX_EVENT_POINTS),
    [playersByStep]
  )

  const handleLeaderboardClick = () => {
    if (showLeaderboard) {
      setShowLeaderboard(false)
    } else {
      setShowHelp(false)
      setShowLeaderboard(true)
    }
  }

  const handleHelpClick = () => {
    if (showHelp) {
      setShowHelp(false)
    } else {
      setShowLeaderboard(false)
      setShowHelp(true)
    }
  }

  return (
    <div
      className="my-container hidden-scrollable rainbow-peak"
      style={{ backgroundImage: "url(/assets/ui/rainbow-peak.webp)" }}
    >
      <header>
        <div className="leaderboard button" onClick={handleLeaderboardClick}>
          <img
            src="/assets/ui/leaderboard.svg"
            alt={t("leaderboard")}
            title={t("leaderboard")}
          />
        </div>
        <h2>
          {t("rainbow_peak.title")}
          <br />
          {profile?.eventFinishTime != null
            ? formatDate(new Date(profile.eventFinishTime))
            : t("rainbow_peak.your_points", {
                points: profile?.eventPoints ?? 0
              })}
          {currentTarget && (
            <>
              <br />
              <span className="current-target">
                {t("rainbow_peak.current_synergy", {
                  synergy: t(`synergy.${currentTarget}`)
                })}
              </span>
            </>
          )}
        </h2>
        <div className="help button" onClick={handleHelpClick}>
          <img src="/assets/ui/help.svg" alt={t("help")} title={t("help")} />
        </div>
      </header>

      {showLeaderboard && (
        <div className="rainbow-peak-leaderboard-container my-container">
          <h3>{t("rainbow_peak.finishers")}</h3>
          <div className="leaderboard-list">
            {players
              .filter((player) => player.eventFinishTime != null)
              .sort((a, b) => a.rank - b.rank)
              .map((player, index) => (
                <div
                  key={player.id || index}
                  className={cc("leaderboard-item", {
                    me: player.id === profile?.uid
                  })}
                >
                  <span className="rank">#{player.rank}</span>
                  <PokemonPortrait avatar={player.avatar} />
                  <span className="player-name">{player.name}</span>
                  <span className="finish-time">
                    {formatDate(new Date(player.eventFinishTime!))}
                  </span>
                </div>
              ))}
            {players.every((player) => player.eventFinishTime == null) && (
              <div className="no-data">{t("no_data_available")}</div>
            )}
          </div>
          <h3>{t("rainbow_peak.runners")}</h3>
          <div className="leaderboard-list">
            {players
              .filter((player) => player.eventFinishTime == null)
              .map((player, index) => {
                const target = getRainbowPeakTargetSynergy(
                  player.id,
                  player.value
                )
                return (
                  <div
                    key={player.id || index}
                    className={cc("leaderboard-item", {
                      me: player.id === profile?.uid
                    })}
                  >
                    <span className="rank">#{player.rank}</span>
                    <PokemonPortrait avatar={player.avatar} />
                    <span className="player-name">{player.name}</span>
                    {target && <SynergyIcon type={target} size="24px" />}
                    <span className="event-points">
                      {t("rainbow_peak.points", { points: player.value })}
                    </span>
                  </div>
                )
              })}
            {players.every((player) => player.eventFinishTime != null) && (
              <div className="no-data">{t("no_data_available")}</div>
            )}
          </div>
        </div>
      )}

      {showHelp && (
        <div className="rainbow-peak-help-container my-container">
          <h3>{t("rainbow_peak.instructions")}</h3>
          <div className="help-content">
            <p>{addIconsToDescription(t("rainbow_peak.help1"))}</p>
            <p>{addIconsToDescription(t("rainbow_peak.help2"))}</p>
            <p>{addIconsToDescription(t("rainbow_peak.help3"))}</p>
            <p style={{ fontStyle: "italic" }}>
              {t("events_reset_info", {
                resetCountdown: formatDuration(resetCountdown)
              })}
            </p>
          </div>
        </div>
      )}

      {finishers && finishers.length > 0 && (
        <div className="rainbow-peak-finishers-players">
          {finishers.map((player, playerIndex) => (
            <div
              key={player.id || playerIndex}
              className={cc("rainbow-peak-player-icon", {
                me: player.id === profile?.uid
              })}
              data-tooltip-id="rainbow-peak-player-detail"
              onMouseOver={() => setPlayerHovered(player)}
              onClick={() => searchById(player.id)}
            >
              <PokemonPortrait avatar={player.avatar} />
            </div>
          ))}
        </div>
      )}
      <div className="rainbow-peak-track">
        {synergyOrder.map((synergy, index) => {
          const stepPlayers = playersByStep.get(index) ?? []
          const currentPlayerIndex = stepPlayers.findIndex(
            (player) => player.id === profile?.uid
          )
          const displayedPlayers =
            currentPlayerIndex >= 5
              ? [...stepPlayers.slice(0, 4), stepPlayers[currentPlayerIndex]]
              : stepPlayers.slice(0, 5)
          const isFinal = synergy === Synergy.STELLAR
          return (
            <div
              key={synergy}
              className={cc("rainbow-peak-step", { final: isFinal })}
              style={
                {
                  "--step-color": SYNERGY_COLORS[synergy]
                } as React.CSSProperties
              }
            >
              <span className="step-number">{index + 1}</span>
              <SynergyIcon type={synergy} size={isFinal ? "56px" : "40px"} />
              <span className="step-name">{t(`synergy.${synergy}`)}</span>
              <div className="rainbow-peak-step-players">
                {displayedPlayers.map((player, playerIndex) => (
                  <div
                    key={player.id || playerIndex}
                    className={cc("rainbow-peak-player-icon", {
                      me: player.id === profile?.uid
                    })}
                    data-tooltip-id="rainbow-peak-player-detail"
                    onMouseOver={() => setPlayerHovered(player)}
                    onClick={() => searchById(player.id)}
                  >
                    <PokemonPortrait avatar={player.avatar} />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {playerHovered && (
        <Tooltip
          id="rainbow-peak-player-detail"
          className="custom-theme-tooltip rainbow-peak-player-tooltip"
          float
        >
          <div className="rainbow-peak-player-detail">
            <p>
              <PokemonPortrait avatar={playerHovered.avatar} />
              {playerHovered.name}
            </p>
            <p>
              {playerHovered.eventFinishTime != null
                ? formatDate(new Date(playerHovered.eventFinishTime))
                : t("rainbow_peak.points", {
                    points: playerHovered.value
                  })}
            </p>
            {(() => {
              const target = getRainbowPeakTargetSynergy(
                playerHovered.id,
                playerHovered.value
              )
              return (
                target && (
                  <p>
                    {t("rainbow_peak.current_synergy", {
                      synergy: t(`synergy.${target}`)
                    })}
                  </p>
                )
              )
            })()}
          </div>
        </Tooltip>
      )}
    </div>
  )
}
