import React from "react"
import { GameAdditionalPokemonsIcon } from "./game-additional-pokemons"
import { GameRegionalPokemonsIcon } from "./game-regional-pokemons"
import { Life } from "../icons/life"
import { Money } from "../icons/money"
import { useTranslation } from "react-i18next"
import { selectCurrentPlayer, useAppSelector } from "../../../hooks"
import PokemonPortrait from "../pokemon-portrait"
import "./game-spectate-player-info.css"

export default function GameSpectatePlayerInfo() {
    const { t } = useTranslation()
    const currentPlayer = useAppSelector(selectCurrentPlayer)
    return (currentPlayer && <div className="game-spectate-player-info my-container" style={{
        display: "flex",
        gap: "1em",
        alignItems: "center"
    }}>
        <GameAdditionalPokemonsIcon />
        <GameRegionalPokemonsIcon />

        <PokemonPortrait avatar={currentPlayer.avatar} />
        <span className="player-name">{t("spectating", { name: currentPlayer.name })}</span>
        <div>
            <div style={{
                display: "flex",
                gap: "1em",
                alignItems: "center"
            }}>
                <span>
                    {t("lvl")} {currentPlayer.experienceManager.level}
                </span>
                <span>
                    <Life value={currentPlayer.life} />
                </span>
                <span>
                    <Money value={currentPlayer.money} />
                </span>
            </div>
            <div style={{
                display: "flex",
                gap: "1em",
                alignItems: "center"
            }}>
                <span>{t("total")}</span>
                <span title={t("total_money_earned")}><img src="assets/icons/money_total.svg" alt="$" style={{ width: "24px", height: "24px" }} /> {currentPlayer.totalMoneyEarned}</span>
                <span title={t("total_player_damage_dealt")}><img src="assets/icons/ATK.png" alt="✊" style={{ width: "24px", height: "24px" }} />{currentPlayer.totalPlayerDamageDealt}</span>
                <span title={t("total_reroll_count")}><img src="assets/ui/refresh.svg" alt="↻" style={{ width: "24px", height: "24px" }} /> {currentPlayer.rerollCount}</span>
            </div>
        </div>
    </div>
    )
}