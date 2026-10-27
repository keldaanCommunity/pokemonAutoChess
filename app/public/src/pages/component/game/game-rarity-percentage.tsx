import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { RarityColor, RarityProbabilityPerLevel } from "../../../../../config"
import { Rarity } from "../../../../../types/enum/Game"
import { useAppSelector } from "../../../hooks"
import { Box } from "../box/box"
import "./game-rarity-percentage.css"

export default function GameRarityPercentage() {
  const { t } = useTranslation()
  const level = useAppSelector((state) => state.game.experienceManager.level)
  const maxLevel = useAppSelector(
    (state) => state.game.experienceManager.maxLevel
  )
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
        className="custom-theme-tooltip"
        place="top-start"
      >
        <Box tooltip>
          <Box.Header title={t("shop.encounter_rates")}>
            <p className="help">{t("shop.increase_level_hint")}</p>
          </Box.Header>
          <Box.Content>
            <table style={{ width: "100%", textAlign: "center" }}>
              <thead>
                <tr>
                  <th></th>
                  {RarityTiers.map((rarity, index) => (
                    <th
                      style={{
                        backgroundColor: RarityColor[rarity],
                        color: "white"
                      }}
                    >
                      {t(`rarity.${rarity}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {t("level")} {level}
                  </td>
                  {RarityTiers.map((rarity, index) => (
                    <td>
                      {Math.round(
                        RarityProbabilityPerLevel[level][index] * 100
                      )}
                      %
                    </td>
                  ))}
                </tr>
                {level < maxLevel && (
                  <tr>
                    <td>
                      {t("level")} {level + 1}
                    </td>
                    {RarityTiers.map((rarity, index) => (
                      <td
                        style={{
                          color:
                            RarityProbabilityPerLevel[level + 1][index] <
                            RarityProbabilityPerLevel[level][index]
                              ? "#e76e55"
                              : RarityProbabilityPerLevel[level + 1][index] >
                                  RarityProbabilityPerLevel[level][index]
                                ? "#92cc41"
                                : "white"
                        }}
                      >
                        {Math.round(
                          RarityProbabilityPerLevel[level + 1][index] * 100
                        )}
                        %
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </Box.Content>
        </Box>
      </Tooltip>
      <div
        className="my-box game-rarity-percentage"
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
