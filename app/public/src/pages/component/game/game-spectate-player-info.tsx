import React from "react"
import { useTranslation } from "react-i18next"
import { selectSpectatedPlayer, useAppSelector } from "../../../hooks"
import { Life } from "../icons/life"
import { Money } from "../icons/money"
import PokemonPortrait from "../pokemon-portrait"
import { GameAdditionalPokemonsIcon } from "./game-additional-pokemons"
import { GameRegionalPokemonsIcon } from "./game-regional-pokemons"
import "./game-spectate-player-info.css"

export default function GameSpectatePlayerInfo() {
  const { t } = useTranslation()
  const spectatedPlayer = useAppSelector(selectSpectatedPlayer)
  return (
    spectatedPlayer && (
      <div
        className="game-spectate-player-info my-container"
        style={{
          display: "flex",
          gap: "1em",
          alignItems: "center"
        }}
      >
        <GameAdditionalPokemonsIcon />
        <GameRegionalPokemonsIcon />

        <PokemonPortrait avatar={spectatedPlayer.avatar} />
        <span className="player-name">
          {t("spectating", { name: spectatedPlayer.name })}
        </span>
        <div>
          <div
            style={{
              display: "flex",
              gap: "1em",
              alignItems: "center"
            }}
          >
            <span>
              {t("lvl")} {spectatedPlayer.experienceManager.level}
            </span>
            <span>
              <Life value={spectatedPlayer.life} />
            </span>
            <span>
              <Money value={spectatedPlayer.money} />
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: "1em",
              alignItems: "center"
            }}
          >
            <span>{t("total")}</span>
            <span title={t("total_money_earned")}>
              <img
                src="assets/icons/money_total.svg"
                alt="$"
                style={{ width: "24px", height: "24px" }}
              />{" "}
              {spectatedPlayer.totalMoneyEarned}
            </span>
            <span title={t("total_player_damage_dealt")}>
              <img
                src="assets/icons/ATK.png"
                alt="✊"
                style={{ width: "24px", height: "24px" }}
              />
              {spectatedPlayer.totalPlayerDamageDealt}
            </span>
            <span title={t("total_reroll_count")}>
              <img
                src="assets/ui/refresh.svg"
                alt="↻"
                style={{ width: "24px", height: "24px" }}
              />{" "}
              {spectatedPlayer.rerollCount}
            </span>
          </div>
        </div>
      </div>
    )
  )
}
