import { Rarity } from "../../../../../types/enum/Game"
import React from "react"
import { Tooltip } from "react-tooltip"
import { useAppSelector } from "../../../hooks"
import {
  RarityProbabilityPerLevel,
  RarityColor
} from "../../../../../types/Config"
import { useTranslation } from "react-i18next"

export default function GameRarityPercentage() {
  const { t } = useTranslation()
  const level = useAppSelector((state) => state.game.experienceManager.level)
  const RarityTiers = [
    Rarity.COMMON,
    Rarity.UNCOMMON,
    Rarity.RARE,
    Rarity.EPIC,
    Rarity.ULTRA
  ]
  return (
    <>
      <Tooltip
        id="detail-game-rarity-percentage"
        className="customeTheme"
        place="top"
      >
        <p>{t("encounter_rates")}</p>
        <table style={{ width: "10vw" }}>
          <thead>
            <tr>
              <th>{t("rarity_label")}</th>
              <th>{t("rate")}</th>
            </tr>
          </thead>
          <tbody>
            {RarityTiers.map((rarity, index) => (
              <tr key={"detail-" + rarity}>
                <td style={{ color: RarityColor[rarity] }}>
                  {t(`rarity.${rarity}`)}
                </td>
                <td>
                  {Math.ceil(RarityProbabilityPerLevel[level][index] * 100)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="help">{t("increase_level_hint")}</p>
      </Tooltip>
      <div
        className="nes-container game-rarity-percentage"
        data-tooltip-id="detail-game-rarity-percentage"
      >
        {RarityTiers.map((rarity, index) => {
          return (
            <div key={rarity} style={{ backgroundColor: RarityColor[rarity] }}>
              {Math.ceil(RarityProbabilityPerLevel[level][index] * 100)}%
            </div>
          )
        })}
      </div>
    </>
  )
}
