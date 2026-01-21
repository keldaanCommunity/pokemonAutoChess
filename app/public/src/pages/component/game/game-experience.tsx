import React from "react"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { MAX_LEVEL } from "../../../../../config"
import { getLevelUpCost } from "../../../../../models/colyseus-models/experience-manager"
import {
  selectCurrentPlayer,
  useAppDispatch,
  useAppSelector
} from "../../../hooks"
import { levelClick } from "../../../stores/NetworkStore"
import { addIconsToDescription } from "../../utils/descriptions"
import { Money } from "../icons/money"

export default function GameExperience() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const experienceManager = useAppSelector(
    (state) => state.game.experienceManager
  )
  const isLevelMax = experienceManager.level >= MAX_LEVEL
  const specialGameRule = useAppSelector((state) => state.game.specialGameRule)
  const levelUpCost = getLevelUpCost(specialGameRule)
  const goldToLevelUp = isLevelMax
    ? null
    : Math.ceil(
        (experienceManager.expNeeded - experienceManager.experience) /
          levelUpCost
      ) * levelUpCost
  const currentPlayer = useAppSelector(selectCurrentPlayer)
  const canLevelup =
    !isLevelMax && currentPlayer && currentPlayer.money >= levelUpCost

  return (
    <div className="game-experience">
      <span>
        {t("lvl")} {experienceManager.level}
      </span>
      <button
        className="bubbly orange buy-xp-button"
        title={t("buy_xp_tooltip", { cost: levelUpCost })}
        onClick={() => {
          dispatch(levelClick())
        }}
      >
        <Money value={t("buy_xp", { cost: levelUpCost })} />
      </button>
      <div className="progress-bar" data-tooltip-id="gold-to-levelup-tooltip">
        <progress
          className="my-progress"
          value={isLevelMax ? 0 : experienceManager.experience}
          max={experienceManager.expNeeded}
        ></progress>
        <span>
          {isLevelMax
            ? "Max Level"
            : experienceManager.experience + "/" + experienceManager.expNeeded}
        </span>
      </div>
      <Tooltip
        id="gold-to-levelup-tooltip"
        className="custom-theme-tooltip"
        place="top"
      >
        <p className="help">
          {isLevelMax ? (
            t("max_level_reached")
          ) : (
            <>
              {t("gold_needed_to_level_up")}
              <b
                style={{
                  color: canLevelup
                    ? "var(--color-fg-green, green)"
                    : "var(--color-fg-red, red)"
                }}
              >
                {addIconsToDescription(`${goldToLevelUp} GOLD`)}
              </b>
              ({t("clicks", { count: goldToLevelUp! / levelUpCost })})
            </>
          )}
        </p>
      </Tooltip>
    </div>
  )
}
