import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useAppSelector } from "../../../hooks"
import PokemonPortrait from "../pokemon-portrait"
import "./victory-road.css"
import { Tooltip } from "react-tooltip"
import { EventPointsPerRank } from "../../../../../types/Config"
import { ILeaderboardInfo } from "../../../../../types/interfaces/LeaderboardInfo"
import { getRankLabel } from "../../../../../types/strings/Strings"
import { clamp } from "../../../../../utils/number"
import { cc } from "../../utils/jsx"

export function VictoryRoad() {
    const { t } = useTranslation()
    const profile = useAppSelector((state) => state.network.profile)
    const eventLeaderboard = useAppSelector(
        (state) => state.lobby.eventLeaderboard
    )
    console.log("Event Leaderboard:", eventLeaderboard)

    const [showLeaderboard, setShowLeaderboard] = useState(false)
    const [showHelp, setShowHelp] = useState(false)
    const [playerHovered, setPlayerHovered] = useState<ILeaderboardInfo | null>(
        null
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
        const y = 80 + clamp(500 - player.value, 0, 500) * (2560 / 500)
        return { left: `${x}%`, top: `${y}px` }
    }

    return (
        <div
            className="my-container hidden-scrollable victory-road"
            style={{ backgroundImage: "url(/assets/ui/victory-road.png)" }}
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
                {eventLeaderboard.map((player, index) => {
                    return (
                        <div
                            key={player.id || index}
                            className="victory-road-player-icon"
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
                        {eventLeaderboard.filter(p => p.eventFinishTime != null).map((player, index) => (
                            <div key={player.id || index} className={cc("leaderboard-item", { me: player.id === profile?.uid })}>
                                <span className="rank">#{player.rank}</span>
                                <PokemonPortrait avatar={player.avatar} />
                                <span className="player-name">{player.name}</span>
                            </div>
                        ))}
                        {eventLeaderboard.length === 0 && (
                            <div className="no-data">{t("no_data_available")}</div>
                        )}
                    </div>
                    <h3>{t("victory_road.runners")}</h3>
                    <div className="leaderboard-list">
                        {eventLeaderboard.filter(p => p.eventFinishTime == null).map((player, index) => (
                            <div key={player.id || index} className={cc("leaderboard-item", { me: player.id === profile?.uid })}>
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
                                <>
                                    <dt>{getRankLabel(rank)}</dt>
                                    <dd
                                        className={cc({
                                            positive: EventPointsPerRank[rank - 1] > 0,
                                            negative: EventPointsPerRank[rank - 1] < 0
                                        })}
                                    >
                                        {(EventPointsPerRank[rank - 1] > 0 ? "+" : "") +
                                            t("victory_road.points", { points: EventPointsPerRank[rank - 1] })}
                                    </dd>
                                </>
                            ))}
                        </dl>
                        <p>{t("victory_road.help2")}</p>
                        <p>{t("victory_road.help3")}</p>
                    </div>
                </div>
            )}
        </div>
    )
}
