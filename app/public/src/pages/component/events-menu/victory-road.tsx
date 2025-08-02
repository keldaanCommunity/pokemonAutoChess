import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { EventPointsPerRank } from "../../../../../types/Config"
import { ILeaderboardInfo } from "../../../../../types/interfaces/LeaderboardInfo"
import { getRankLabel } from "../../../../../types/strings/Strings"
import { clamp } from "../../../../../utils/number"
import { useAppSelector } from "../../../hooks"
import { setEventLeaderboard } from "../../../stores/LobbyStore"
import { formatDate, formatDuration } from "../../utils/date"
import { cc } from "../../utils/jsx"
import PokemonPortrait from "../pokemon-portrait"
import "./victory-road.css"

export function VictoryRoad() {
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
    const [playerHovered, setPlayerHovered] = useState<ILeaderboardInfo | null>(
        null
    )

    const markers = [50, 100, 150, 200, 250, 300, 350, 400, 450].map(
        (value, index) => ({
            top: `${230 + clamp(500 - value, 0, 500) * (2400 / 500)}px`,
            value
        })
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

    function getPlayerCoords(player: ILeaderboardInfo, index: number) {
        let x = 34 + ((index * 7) % 9) * 4
        if (player.value >= 500) {
            x = 45.5 + ((index * 7) % 9)
        }
        const y = 245 + clamp(500 - player.value, 0, 500) * (2400 / 500)
        return { left: `${x}%`, top: `${y}px` }
    }

    // midnight UTC on the first day of each month
    const now = new Date()
    const resetDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0))
    const [resetCountdown, setResetCountdown] = useState(
        Math.round((resetDate.getTime() - now.getTime()) / 1000)
    )

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date()
            setResetCountdown(Math.round((resetDate.getTime() - now.getTime()) / 1000))
        }, 1000)
        return () => clearInterval(timer)
    }, [resetDate])

    return (
        <div
            className="my-container hidden-scrollable victory-road"
            style={{ backgroundImage: "url(/assets/ui/victory-road.webp)" }}
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
                    {t("victory_road.title")}
                    <br />
                    {t("victory_road.your_points", { points: profile?.eventPoints ?? 0 })}
                </h2>
                <div className="help button" onClick={handleHelpClick}>
                    <img src="/assets/ui/help.svg" alt={t("help")} title={t("help")} />
                </div>
            </header>

            <div>
                {markers.map((marker, index) => (
                    <div
                        className="victory-road-marker"
                        key={index}
                        style={{ [index % 2 ? "left" : "right"]: "5%", top: marker.top }}
                    >
                        <span>
                            {index % 2 ? "" : "◄"}
                            {marker.value}
                            {index % 2 ? "►" : ""}
                        </span>
                    </div>
                ))}
                {eventLeaderboard.map((player, index) => {
                    return (
                        <div
                            key={player.id || index}
                            className={cc("victory-road-player-icon", {
                                me: player.id === profile?.uid
                            })}
                            data-tooltip-id="victory-road-player-detail"
                            onMouseOver={() => setPlayerHovered(player)}
                            style={{
                                position: "absolute",
                                ...getPlayerCoords(player, index)
                            }}
                        >
                            <PokemonPortrait avatar={player.avatar} />
                        </div>
                    )
                })}
            </div>

            {playerHovered && (
                <Tooltip
                    id="victory-road-player-detail"
                    className="custom-theme-tooltip victory-road-player-tooltip"
                    float
                >
                    <div className="victory-road-player-detail">
                        <p>
                            <PokemonPortrait avatar={playerHovered.avatar} />
                            {playerHovered.name}
                        </p>
                        <p>{t("victory_road.points", { points: playerHovered.value })}</p>
                    </div>
                </Tooltip>
            )}

            {showLeaderboard && (
                <div className="victory-road-leaderboard-container my-container">
                    <h3>{t("victory_road.finishers")}</h3>
                    <div className="leaderboard-list">
                        {eventLeaderboard
                            .filter((p) => p.eventFinishTime != null)
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
                        {eventLeaderboard.length === 0 && (
                            <div className="no-data">{t("no_data_available")}</div>
                        )}
                    </div>
                    <h3>{t("victory_road.runners")}</h3>
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
                                        {t("victory_road.points", { points: player.value })}
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
                <div className="victory-road-help-container my-container">
                    <h3>{t("victory_road.instructions")}</h3>
                    <div className="help-content">
                        <p>{t("victory_road.help1")}</p>
                        <dl>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((rank) => (
                                <React.Fragment key={rank}>
                                    <dt>{getRankLabel(rank)}</dt>
                                    <dd
                                        className={cc({
                                            positive: EventPointsPerRank[rank - 1] > 0,
                                            negative: EventPointsPerRank[rank - 1] < 0
                                        })}
                                    >
                                        {(EventPointsPerRank[rank - 1] > 0 ? "+" : "") +
                                            t("victory_road.points", {
                                                points: EventPointsPerRank[rank - 1]
                                            })}
                                    </dd>
                                </React.Fragment>
                            ))}
                        </dl>
                        <p>{t("victory_road.help2")}</p>
                        <p style={{ fontStyle: "italic" }}>{t("victory_road.reset_info", { resetCountdown: formatDuration(resetCountdown) })}</p>
                    </div>
                </div>
            )}
        </div>
    )
}
