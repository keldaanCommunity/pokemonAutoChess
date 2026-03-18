import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ExpPerExpeditionRank } from "../../../../../config/game/expeditions"
import {
  getExpeditionLabel,
  getPlayerExpeditions
} from "../../../../../models/expeditions"
import { Expedition } from "../../../../../types/enum/Expedition"
import { useAppSelector } from "../../../hooks"
import { setEventLeaderboard } from "../../../stores/LobbyStore"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import PokemonPortrait from "../pokemon-portrait"
import "./expeditions.css"

export function Expeditions() {
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

  if (!profile) return null
  const expeditions = getPlayerExpeditions(profile)

  return (
    <div className="my-container hidden-scrollable expeditions">
      <header>
        <div className="leaderboard button" onClick={handleLeaderboardClick}>
          <img
            src="/assets/ui/leaderboard.svg"
            alt={t("leaderboard")}
            title={t("leaderboard")}
          />
        </div>
        <p>
          {t("expeditions.title")}
          <br />
          {t("expeditions.your_points", { points: profile?.eventPoints ?? 0 })}
        </p>
        <div className="help button" onClick={handleHelpClick}>
          <img src="/assets/ui/help.svg" alt={t("help")} title={t("help")} />
        </div>
      </header>

      <div>
        <ul>
          {expeditions.map((expedition) => (
            <li key={expedition.type + expedition.rank}>
              <ExpeditionBox expedition={expedition} />
            </li>
          ))}
        </ul>
      </div>

      {showLeaderboard && (
        <div className="expeditions-leaderboard-container my-container">
          <h3>{t("expeditions.leaderboard")}</h3>
          <div className="leaderboard-list">
            {eventLeaderboard
              .filter((p) => p.eventFinishTime == null)
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
                  <span className="event-points">
                    {t("expeditions.points", { points: player.value })}
                  </span>
                </div>
              ))}
            {eventLeaderboard.length === 0 && (
              <div className="no-data">{t("no_data_available")}</div>
            )}
          </div>
        </div>
      )}

      {showHelp && (
        <div className="expeditions-help-container my-container">
          <h3>{t("expeditions.instructions")}</h3>
          <div className="help-content">
            <p>{t("expeditions.help1")}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function ExpeditionBox(props: { expedition: Expedition }) {
  const { t } = useTranslation()
  return (
    <div className="expedition my-box">
      <img
        className="expedition-illustration"
        src={`/assets/notifications/${props.expedition.type}_${props.expedition.rank}.jpg`}
        alt=""
      />
      <p
        className="expedition-rank"
        style={{
          backgroundImage: `url(/assets/ranks/expedition-ranks.png)`,
          backgroundPosition: `0px ${props.expedition.rank === "S" ? 25 : props.expedition.rank === "A" ? 20 : props.expedition.rank === "B" ? 15 : props.expedition.rank === "C" ? 10 : props.expedition.rank === "D" ? 5 : 0}px`,
          backgroundSize: "240px 40px",
          color: "transparent",
          height: "40px",
          width: "40px",
          display: "inline-block"
        }}
      >
        {props.expedition.rank}
      </p>
      <div className="expedition-objective">
        <span className="expedition-type">
          {t("expeditions." + props.expedition.type)}
        </span>
        <p>{addIconsToDescription(getExpeditionLabel(props.expedition))}</p>
        <p className="expedition-rewards">
          {t("expeditions.reward", {
            points: ExpPerExpeditionRank[props.expedition.rank]
          })}
        </p>
      </div>
    </div>
  )
}
